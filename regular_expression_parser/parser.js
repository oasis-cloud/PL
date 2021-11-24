const tokenize = require('./tokenizer')

function parse(text) {
    const result = []
    const allTokens = tokenize(text)
    for (let i = 0; i < allTokens.length; i++) {
        const tok = allTokens[i]
        const last = i === allTokens.length - 1
        handle(result, tok, last)
    }
    return compress(result)
}

function handle(result, tok, last) {
    if (tok.kind === 'Lit') {
        result.push(tok)
    } else if (tok.kind === 'Alt') {
        tok.child = {left: result.pop(), right: null}
        result.push(tok)
    } else if (tok.kind === 'Start') {
        result.push(tok)
    } else if (tok.kind === "End" && last) {
        result.push(tok)
    } else if (tok.kind === "Any") {
        tok.child = result.pop()
        result.push(tok)
    } else if (tok.kind === 'GroupStart') {
        result.push(tok)
    } else if (tok.kind === 'GroupEnd') {
        result.push(groupEnd(result, tok))
    } else {
        throw new Error('Unexpect token')
    }
}

function groupEnd(result, tok) {
    const group = {
        kind: "Group",
        loc: null,
        end: tok.loc,
        children: []
    }
    while (true) {
        const child = result.pop()
        if(child.kind === "GroupStart") {
            group.loc = child.loc
            break
        }
        group.children.unshift(child)
    }
    return group
}

function compress(raw) {
    const cooked = []
    while (raw.length > 0) {
        const tok = raw.pop()
        if(tok.kind === 'Alt') {
            tok.child.right = cooked.shift()
        } else if(tok.kind === "Group") {
            tok.children = compress(tok.children)
        }
        cooked.unshift(tok)
    }
    return cooked
}

console.log(JSON.stringify(parse('((a|b)b)c'), null, '  '))
