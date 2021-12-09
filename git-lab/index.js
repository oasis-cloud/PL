function Git(name) {
    this.name = name
    this.head = null
    this.lastCommitId = -1

    const master = new Barnch('master', null)
}

function Commit(id, parent,message) {
    this.id = id
    this.parent = parent
    this.message = message
}
Git.prototype.commit = function (message) {
    const commit = new Commit(++this.lastCommitId, this.head, message)
    this.head = commit
    return commit
}
Git.prototype.log = function () {
    let commit = this.head
    const history = []
    while (commit) {
      history.push(commit)
      commit = commit.parent
    }
    return history
}

function Branch(name, commit) {
    this.name = name
    this.commit = commit

}

const repo = new Git('my-repo')
repo.commit("make commit work")
repo.commit("make commit work1")
repo.commit("make commit work2")

console.log(repo.log())
