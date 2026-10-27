"""Prepare the supplied portrait video for Ultra without changing its scenes or timing.

Usage: python tools/prepare_ultra_video.py path/to/reference.mp4
Requires ffmpeg on PATH, or: python -m pip install imageio-ffmpeg
The 2160x3840 output is upscaled from the reference, not native 4K footage.
"""
import argparse
from pathlib import Path
import shutil
import subprocess

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('source', type=Path)
args = parser.parse_args()
source = args.source.resolve(strict=True)
ffmpeg = shutil.which('ffmpeg')
if not ffmpeg:
    import imageio_ffmpeg
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()

target = Path(__file__).resolve().parents[1] / 'ktx-website' / 'assets' / 'ultra'
target.mkdir(parents=True, exist_ok=True)
shutil.copyfile(source, target / 'reference.mp4')
subprocess.run([
    ffmpeg, '-hide_banner', '-loglevel', 'warning', '-y', '-i', str(source),
    '-map', '0:v:0', '-an', '-vf', 'scale=2160:3840:flags=lanczos,setsar=1',
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '19', '-pix_fmt', 'yuv420p',
    '-threads', '4', '-movflags', '+faststart', str(target / 'scene-4k.mp4'),
], check=True)
subprocess.run([
    ffmpeg, '-hide_banner', '-loglevel', 'warning', '-y', '-ss', '2',
    '-i', str(target / 'scene-4k.mp4'), '-frames:v', '1', '-q:v', '2',
    '-update', '1', str(target / 'poster.jpg'),
], check=True)
print('Prepared portrait UHD video (2160x3840), original reference, and poster.')
