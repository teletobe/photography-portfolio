# generates the soft "developing" masks used by the room (assets/room.css, assets/room.js)
# run: python3 tools/make-masks.py
import os
import numpy as np
from PIL import Image

OUT = os.path.join(os.path.dirname(__file__), "..", "assets", "masks")
rng = np.random.default_rng(7)


def noise(w, h, octaves=(4, 9, 21), weights=(0.6, 0.3, 0.1)):
    # smooth value noise in [-1, 1] by bicubic-upscaling small random grids
    acc = np.zeros((h, w))
    for o, wt in zip(octaves, weights):
        g = rng.random((o, o)).astype(np.float32)
        acc += wt * np.asarray(Image.fromarray(g).resize((w, h), Image.BICUBIC))
    return (acc - acc.min()) / (acc.max() - acc.min()) * 2 - 1


def smooth(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def save(name, a):
    h, w = a.shape
    # noise can push the fade past the border: force it to 0 at the edges
    u, v = grid(w, h)
    a = a * smooth(0, 0.06, np.minimum(u, 1 - u)) * smooth(0, 0.06, np.minimum(v, 1 - v))
    img = np.zeros((h, w, 4), np.uint8)
    img[..., :3] = 255
    img[..., 3] = (np.clip(a, 0, 1) * 255).astype(np.uint8)
    Image.fromarray(img, "RGBA").save(os.path.join(OUT, name + ".png"), optimize=True)


def grid(w, h):
    return np.meshgrid(np.linspace(0, 1, w), np.linspace(0, 1, h))


# landscape: sky dissolves upwards, ragged sides, ground fades out
w, h = 1200, 800
u, v = grid(w, h)
n = noise(w, h)
side = smooth(0.0, 0.26, np.minimum(u, 1 - u) + n * 0.07)
top = smooth(0.02, 0.5, v + n * 0.08)
bottom = smooth(0.0, 0.2, (1 - v) + n * 0.06)
save("land", side * top * bottom)

# blob: organic ellipse, for people / street / single subjects
for name, (w, h) in {"blob": (1000, 1000), "tall": (800, 1100)}.items():
    u, v = grid(w, h)
    n = noise(w, h)
    d = np.hypot((u - 0.5) / 0.5, (v - 0.5) / 0.5)
    save(name, 1 - smooth(0.5, 0.98, d + n * 0.16))
print("masks written to", OUT)
