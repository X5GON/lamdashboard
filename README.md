# Dashboard for X5GON project

This is an implementation of a dashboard for the X5GON project.

It is released under the terms of the MIT license.

## Implementation notes

The code is conceived to be build-less, directly usable from any
checkout of the code.

It is implemented using the VueJS framework. Most components are
defined in .vue syntax and loaded through http-vue-loader. This
approach has one major drawback: since code is dynamically loaded and
interpreted, the devtools interaction is not as direct as it could be.

## Hacking

It is advised to install vuejs devtools extensions to facilitate debugging.

## Authors

Architecture and implementation: Olivier Aubert <contact@olivieraubert.net>
Graphical design: Maxime Zoffoli <mail@maximezoffoli.com>
