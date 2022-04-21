//Replaces from DOM text nodes
function replaceTextInDOM(element, pattern, replacement) {
    for (let node of element.childNodes) {
        switch (node.nodeType) {
            case window.Node.ELEMENT_NODE:
                replaceTextInDOM(node, pattern, replacement);
                break;
            case window.Node.TEXT_NODE:
                var txt = window.document.createElement("span");
                txt.innerHTML = node.textContent.replace(pattern, replacement);
                node.replaceWith(txt);
                break;
            case window.Node.DOCUMENT_NODE:
                replaceTextInDOM(node, pattern, replacement);
        }
    }
}

/**
 * Searches for links in the HTML and replaces it with an image tag
 * @param text The text that contains the links
 * @param options An object which contains your options
 */
async function HTMLToOembed(html, options){
    var matches

    //Default options
    options = options || {}

    // Image embeding

    //Converts gyazo links to img tags
    options.gyazo = "gyazo" in options ? options.gyazo : true
    if(options.gyazo){
        matches = html.innerHTML.matchAll(/https:\/\/gyazo.com\/\w*/g)
        for (const match of matches) {
            embedResponse = await fetch(`https://api.gyazo.com/api/oembed?url=${match[0]}`)
            .then(res => res.json())
            .catch(e=>{console.log(e)})
            
            // Inserts embed
            //Embeds gifs
            if(embedResponse.html){
                let rx = new RegExp(match[0])
                replaceTextInDOM(html, rx, embedResponse.html)
            }
            //Converts images to img tags
            else{
                let rx = new RegExp(match[0])
                let newTag = `<img src="${embedResponse.url}"/>`
                replaceTextInDOM(html, rx, newTag)
            }
        }
    }

    //Converts image links to img tags
    options.imgFile = "imgFile" in options ? options.imgFile : true
    if(options.imgFile){
        matches = html.innerHTML.matchAll(/https:\/\/([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif))/ig)
        for (const match of matches) {
            //If a whitelist is specified, check if the matched URL's domain is whitelisted
            if("fileDomainWhitelist" in options){
                //Do not convert this match because it is not a whitelisted domain
                if(!options.fileDomainWhitelist.find(domain => match[0].match(domain))) continue
            }

            //Inserts embed; Replaces image link with img tag
            let rx = new RegExp(match[0])
            replaceTextInDOM(html, rx, `<img src="${match[0]}"/>`)
        }
    }

    //Converts video links to img tags
    options.videoFile = "videoFile" in options ? options.videoFile : true
    if(options.videoFile){
        matches = html.innerHTML.matchAll(/https:\/\/([a-z\-_0-9\/\:\.]*\.(mp4))/ig)
        for (const match of matches) {
            //If a whitelist is specified, check if the matched URL's domain is whitelisted
            if("fileDomainWhitelist" in options){
                //Do not convert this match because it is not a whitelisted domain
                if(!options.fileDomainWhitelist.find(domain => match[0].match(domain))) continue
            }

            //Inserts embed; Replaces image link with img tag
            let rx = new RegExp(match[0])
            replaceTextInDOM(html, rx, 
`<video controls controlsList="nodownload" preload="none">
    <source src="${match[0]}" type="video/mp4">
    Your browser does not support the video tag.
</video>`)
        }
    }

    // Platform embeds

    //Embeds Imgur links. Should turn this into a plain image tag if I can figure out how to extract the image
    options.imgur = "imgur" in options ? options.imgur : true
    if(options.imgur){
        matches = html.innerHTML.matchAll(/https:\/\/imgur.com\/(a|gallery)\/(\w*)/g)
        for (const match of matches) {
            embedResponse = await fetch(`https://api.imgur.com/oembed?url=${match[0]}`)
            .then(res => res.json())
            .catch(e=>{})

            //Inserts embed
            let rx = new RegExp(match[0])
            replaceTextInDOM(html, rx, embedResponse.html)
        }
    }

    //Embeds Codepen pens
    options.codepen = "codepen" in options ? options.codepen : true
    if(options.codepen){
        matches = html.innerHTML.matchAll(/https:\/\/codepen.io\/[a-z\-_0-9\/\:\.]*\/pen\/\w*/g)
        for (const match of matches) {
            embedResponse = await fetch(`http://codepen.io/api/oembed?format=json&url=${match[0]}`)
            .then(res => res.json())
            .catch(e=>{})

            //Inserts embed
            let rx = new RegExp(match[0])
            replaceTextInDOM(html, rx, embedResponse.html)
        }
    }
}