# Obsidian Mind Map

Fork of [https://github.com/lynchjames/obsidian-mind-map](https://github.com/lynchjames/obsidian-mind-map) with support for exporting SVGs and modern versions of its dependencies.

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/zatkins-dev/obsidian-mind-map/release.yml?branch=main&logo=github&style=for-the-badge) ![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/zatkins-dev/obsidian-mind-map?style=for-the-badge&sort=semver)

This repository contains a plugin for [Obsidian](https://obsidian.md/) for viewing Markdown notes as Mind Maps using [Markmap](https://markmap.js.org/).

A similar plugin is available for [Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=gera2ld.markmap-vscode).

## Features

- Preview your current note as a Mind Map
- Mind Map preview updates as you select other panes, similar to the [Local Graph](https://forum.obsidian.md/t/how-to-open-a-local-graph-view-pane-on-the-right-sidebar/7190), [Outline](https://publish.obsidian.md/help/Plugins/Outline) and [Backlink](https://publish.obsidian.md/help/Plugins/Backlinks) panes

![Mind Map Demo Image](https://raw.githubusercontent.com/zatkins-dev/obsidian-mind-map/main/images/mind-map-demo.png)

## Usage

You can open the Mind Map preview for the current note with a command.

![Mind Map Preview Command](https://raw.githubusercontent.com/zatkins-dev/obsidian-mind-map/main/images/mind-map-preview-command.png)

### Preview More Options Menu

The Mind Map Preview view has 2 options from the "more options" menu:

![Mind Map Preview More Options](https://raw.githubusercontent.com/zatkins-dev/obsidian-mind-map/main/images/mind-map-view-more-options.png)

#### Pin

Allows you to pin the Mind Map preview pane to the current note so that you can select other notes with the current Mind Map remaining in place. A pin icon will appear in the header of the Mind Map preview pane. Click the pin icon to unpin.

#### Copy screenshot

Places a copy of the Mind Map PNG on your clipboard allowing you to paste it into a note in Obsidian or into an image editor of your choice.

#### Save SVG

Save a copy of the Mind Map SVG on to your local machine.

## Compatibility

Custom plugins are only available for Obsidian v0.9.7+.

The current API of this repo targets Obsidian **v0.15.0**.

## Manual installation

1. Download the [latest release](https://github.com/zatkins-dev/obsidian-mind-map/releases/latest)
1. Extract the obsidian-day-planner folder from the zip to your vault's plugins folder: `<vault>/.obsidian/plugins/`
   Note: On some machines the `.obsidian` folder may be hidden. On MacOS you should be able to press `Command+Shift+Dot` to show the folder in Finder.
1. Reload Obsidian
1. If prompted about Safe Mode, you can disable safe mode and enable the plugin.

## For developers

Pull requests are both welcome and appreciated. 😀

If you would like to contribute to the development of this plugin, please follow the guidelines provided in [CONTRIBUTING.md](CONTRIBUTING.md).

## Donating

This plugin is provided free of charge. If you would like to donate something to the original author, you can via [PayPal](https://paypal.me/lynchjames2020). Thank you!
