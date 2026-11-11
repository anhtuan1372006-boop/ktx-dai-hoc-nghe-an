"""Tile-based Real-ESRGAN x4plus upscaling (fixed 128x128 ONNX model) with feathered overlap blending."""
import sys, time
import numpy as np
import onnxruntime as ort
from PIL import Image

model, src, dst = sys.argv[1], sys.argv[2], sys.argv[3]
T, OV = 128, 24            # tile size, overlap (input px)
S = 4
STEP = T - OV

so = ort.SessionOptions()
so.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
sess = ort.InferenceSession(model, so, providers=['CPUExecutionProvider'])
iname = sess.get_inputs()[0].name

img = np.asarray(Image.open(src).convert('RGB')).astype(np.float32) / 255.0
H, W, _ = img.shape
# pad so the grid covers the image fully (reflect keeps edges natural)
nx = max(1, int(np.ceil((W - OV) / STEP)))
ny = max(1, int(np.ceil((H - OV) / STEP)))
PW, PH = nx * STEP + OV, ny * STEP + OV
pad = np.pad(img, ((0, PH - H), (0, PW - W), (0, 0)), mode='reflect')

out = np.zeros((PH * S, PW * S, 3), np.float32)
wsum = np.zeros((PH * S, PW * S, 1), np.float32)
# feather weight: linear ramp over the overlap zone on each side
r = np.ones(T * S, np.float32)
ramp = np.linspace(0.02, 1, OV * S, dtype=np.float32)
r[:OV * S] = ramp
r[-OV * S:] = ramp[::-1]
wt = (r[:, None] * r[None, :])[..., None]

t0 = time.time()
n = 0
for j in range(ny):
    for i in range(nx):
        y, x = j * STEP, i * STEP
        tile = pad[y:y + T, x:x + T].transpose(2, 0, 1)[None]
        res = sess.run(None, {iname: np.ascontiguousarray(tile)})[0][0].transpose(1, 2, 0)
        out[y * S:(y + T) * S, x * S:(x + T) * S] += res * wt
        wsum[y * S:(y + T) * S, x * S:(x + T) * S] += wt
        n += 1
        if n % 20 == 0:
            print(f'{n}/{nx*ny} tiles  {time.time()-t0:.0f}s', flush=True)
out = out / np.maximum(wsum, 1e-6)
out = np.clip(out[:H * S, :W * S] * 255 + 0.5, 0, 255).astype(np.uint8)
Image.fromarray(out).save(dst)
print('done', out.shape, f'{time.time()-t0:.0f}s')
