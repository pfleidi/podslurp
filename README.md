# Podslurp

[![Build Status](https://travis-ci.org/pfleidi/podslurp.svg?branch=master)](https://travis-ci.org/pfleidi/podslurp)
[![Coverage Status](https://coveralls.io/repos/pfleidi/podslurp/badge.svg?branch=master&service=github)](https://coveralls.io/github/pfleidi/podslurp?branch=master)

Podslurp is an HTTP download server with a minimal JSON API for download  statistics.

## Installation

```bash
git clone https://github.com/pfleidi/podslurp.git && cd podslurp
npm install
```

## Usage

```bash
Usage: index.js --rootpath /path/to/filedir [--port PORT]

Options:
  --rootpath, -r  the root path where the files are located           [required]
  --port, -p      the port to listen on                          [default: 3000]
```

## Run tests

```bash
npm install -g gulp
gulp test
```

## License

The MIT License (MIT)
