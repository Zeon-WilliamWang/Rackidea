#!/bin/bash
# extract-frames.sh
# Usage: ./extract-frames.sh path/to/your-video.mp4
#
# Extracts frames from your video at 30fps as JPEGs into video/frames/.
# After running, update TOTAL_FRAMES in js/scroll-video.js.

VIDEO="$1"

if [ -z "$VIDEO" ]; then
  echo "Usage: ./extract-frames.sh path/to/your-video.mp4"
  exit 1
fi

OUTDIR="video/frames"
mkdir -p "$OUTDIR"

echo "Extracting frames from: $VIDEO"
echo "Output directory: $OUTDIR"

ffmpeg -i "$VIDEO" \
  -vf "fps=30,scale=1920:-2" \
  -q:v 3 \
  "$OUTDIR/frame%04d.jpg"

FRAME_COUNT=$(ls "$OUTDIR"/frame*.jpg 2>/dev/null | wc -l | tr -d ' ')
echo ""
echo "Done! Extracted $FRAME_COUNT frames."
echo ""
echo "Next step: open js/scroll-video.js and set:"
echo "  const TOTAL_FRAMES = $FRAME_COUNT;"
