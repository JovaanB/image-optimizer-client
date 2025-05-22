#!/bin/bash

set -e

# 1. Cloner les sources
if [ ! -d opencv ]; then
  git clone https://github.com/opencv/opencv.git
fi
if [ ! -d opencv_contrib ]; then
  git clone https://github.com/opencv/opencv_contrib.git
fi

# 2. Installer Emscripten
if [ ! -d emsdk ]; then
  git clone https://github.com/emscripten-core/emsdk.git
fi
cd emsdk
./emsdk install latest
./emsdk activate latest
source ./emsdk_env.sh
cd ..

# 3. Créer le dossier de build
rm -rf build_js
mkdir build_js && cd build_js

# Désactiver explicitement SIMD côté Emscripten
export CFLAGS="$CFLAGS -mno-simd128"
export CXXFLAGS="$CXXFLAGS -mno-simd128"

# 4. Configuration CMake minimale
emcmake cmake \
  -D CMAKE_BUILD_TYPE=Release \
  -D BUILD_SHARED_LIBS=OFF \
  -D BUILD_LIST=core,imgproc \
  -D BUILD_opencv_js=ON \
  -D BUILD_EXAMPLES=OFF \
  -D BUILD_TESTS=OFF \
  -D BUILD_PERF_TESTS=OFF \
  -D ENABLE_SSE=OFF \
  -D ENABLE_SSE2=OFF \
  -D ENABLE_SSE3=OFF \
  -D ENABLE_SSSE3=OFF \
  -D ENABLE_SSE4_1=OFF \
  -D ENABLE_SSE4_2=OFF \
  -D ENABLE_AVX=OFF \
  -D ENABLE_NEON=OFF \
  -D ENABLE_VFPV3=OFF \
  -D ENABLE_WASM_SIMD=OFF \
  -D OPENCV_ENABLE_INTRINSICS=OFF \
  -D ENABLE_INTRINSICS=OFF \
  -D ENABLE_SIMD=OFF \
  ../opencv

# 5. Compilation
emmake make -j1

# 6. Résultat
echo "✅ Build terminé !"
echo "Fichiers générés dans: build_js/bin/ (opencv.js, opencv.wasm, etc.)"
