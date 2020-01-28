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

## Architecture

All application-wide state (search results, basket, sequence) is
stored in the Store component, especially interactions with the API.

## Hacking

It is advised to install vuejs devtools extensions to facilitate debugging.

## Debugging

If you enter a query in the form d:NAME the application will fetch
data/NAME.json as debug data. It will use it to populate search
results, basket and sequence.

## Authors

Architecture and implementation: Olivier Aubert <contact@olivieraubert.net>
Graphical design: Maxime Zoffoli <mail@maximezoffoli.com>
