const postListPromise = fetch("resources/postList.json").then(data => {
    return data.json()
})

function decodeURIParams() {
    const url = window.location.href
    const obj = {}
    let params = url.split('?')

    //if there's no ? in the uri then params[1] will be undefined
    if (params[1]) {
        //assign params to be the split('=') of all text after the ?
        params = params[1].split('=')
    }

    for (const param of params) {
        obj[params[0]] = params[1]
    }

    return obj
}


function renderPostList(postList) {
    for(const post of postList.posts) {
        renderListEntry(post)
    }

    document.getElementById("postTemplate").remove()

    //after all the content has been created, call the loaded
    //function to fade in each element
    loaded()
}


function renderListEntry(post) {
    const a = document.createElement("a")
    const li = document.getElementById("postTemplate").cloneNode(true)
    const postList = document.getElementById("postList")

    a.href = `?link=${post.link}`

    li.childNodes[1].innerText = post.title
    li.childNodes[3].innerText = post.desc

    a.appendChild(li)
    postList.appendChild(a)
}


//render a blog post. The argument is the post's entry in
//postList.json
function renderPost(post) {
    fetch(`blogPosts/${post.link}.html`).then(data => {
        return data.text()
    }).then(text => {
        const blog = document.getElementById("blog")
        const blogPost = document.createElement("div")
        const title = document.createElement("h2")
        const returnLink = document.createElement("a")

        returnLink.href = "blog.html"
        returnLink.innerText = "Back to blog"

        blogPost.id = "blogPost"

        title.innerText = post.title

        blogPost.appendChild(title)
        blogPost.innerHTML += text

        blog.appendChild(returnLink)
        blog.appendChild(blogPost)

        loaded()
    }).catch(error => {
        document.getElementById("blog").innerHTML = `${error}`
    })
}


function main() {
    const params = decodeURIParams()

    postListPromise.then(json => {
        //if there's no "link=<>" in the uri, then just
        //render the list of posts, else render the linked
        //post
        if (params.link) {
            document.getElementById("postList").remove()
            
            //check all posts for one with the correct link
            //then render it
            for (const post of json.posts) {
                if (post.link == params.link) {
                    renderPost(post)
                    break
                }
            }
            
        }
        else {
            renderPostList(json)
        }
    })
}


//set the blog posts to be loaded as soon as the DOM content is loaded
//maybe already load the postList.json file by here
document.addEventListener("DOMContentLoaded", main)