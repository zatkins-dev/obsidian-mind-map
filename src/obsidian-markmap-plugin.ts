import { IPureNode } from 'markmap-common';
import { getLinkpath, Vault } from 'obsidian';
import { INTERNAL_LINK_REGEX } from './constants';

export default class ObsidianMarkmap {
    vaultName: string;

    constructor(vault: Vault) {
        this.vaultName = vault.getName();
    }

    updateInternalLinks(node: IPureNode) {
        this.replaceInternalLinks(node);
        if (node.children) {
            node.children.forEach((n) => this.updateInternalLinks(n));
        }
    }

    private replaceInternalLinks(node: IPureNode) {
        const matches = this.parseValue(node.content);
        for (let i = 0; i < matches.length; i++) {
            const match = matches[i];
            if (!match) continue;
            if (!match.groups) continue;
            const isWikiLink = match.groups['wikitext'];
            const linkText = isWikiLink ? match.groups['wikitext'] : match.groups['mdtext'];
            const linkPath = isWikiLink ? linkText : match.groups['mdpath'];
            if (!linkPath || linkPath.startsWith('http')) {
                continue;
            }
            const url = `obsidian://open?vault=${this.vaultName}&file=${isWikiLink ? encodeURI(getLinkpath(linkPath)) : linkPath}`;
            const link = `<a href="${url}">${linkText}</a>`;
            node.content = node.content.replace(match[0], link);
        }
    }

    private parseValue(v: string) {
        const matches: RegExpExecArray[] = [];
        let match = INTERNAL_LINK_REGEX.exec(v);
        while (match) {
            matches.push(match);
            match = INTERNAL_LINK_REGEX.exec(v);
        }
        return matches;
    }
}
