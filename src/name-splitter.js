const split = function(name) {
    if (!name || typeof name !== 'string') {
        throw new Error('[ERROR] Empty name or unkonw name type');
    }
    let pkgName;
    let tag;
    if (name.indexOf(':') !== -1) {
        const nameAndTag = name.split(':');
        if (nameAndTag.length !== 2) {
            throw new Error('[ERROR] Wrong name with tag, use [<repository>/]<name>[:<tag>]');
        }
        pkgName = nameAndTag[0];
        tag = nameAndTag[1];
    } else {
        console.log('[WARNING] No tag, use default latest');
        pkgName = name;
        tag = 'latest'
    }
    const repoAndName = pkgName.split('/');
    if (repoAndName.length === 1) {
        return {
            repository: 'library',
            name: pkgName,
            tag,
            path: `library/${pkgName}/${tag}`
        }
    }
    if (repoAndName.length === 2) {
        return {
            repository: repoAndName[0],
            name: repoAndName[1],
            tag,
            path: `${repoAndName[0]}/${repoAndName[1]}/${tag}`
        }
    }
    throw new Error('[ERROR] Wrong package name, use [<repository>/]<name>[:<tag>]');
}

module.exports = {
    split
}
