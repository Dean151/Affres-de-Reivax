---
---

clickBehavior = (event) ->
    event?.preventDefault()
    section = this.parentElement.parentElement 
    isActive = section.classList.contains 'active'
    (
        s.classList.remove 'active' ;
        articles = s.getElementsByTagName 'article'
        articles[0].setAttribute('aria-hidden', 'true')
    ) for s in document.getElementsByTagName 'section'
    if !isActive
        section.classList.add 'active'
        articles = section.getElementsByTagName 'article'
        articles[0].removeAttribute('aria-hidden')
        title = this.getAttribute 'data-title'
        link = this.getAttribute 'href'
    else
        title = document.body.getAttribute 'data-title'
        link = '/'
    if event?
        history.pushState { id: section.getAttribute('id') }, title, link
    document.title = title
    false

window.onpopstate = (event) ->
    if event.state?.id?
      s = document.getElementById event.state.id
    else
      sections = document.getElementsByClassName 'active'
      s = sections[0]
    console.log s
    if s?
        t = s.getElementsByTagName 'h2'
        console.log t
        l = t[0].getElementsByTagName 'a'
        console.log l
        clickBehavior.call(l[0]);

links = document.getElementsByClassName 'mono-link'
link.addEventListener 'click', clickBehavior for link in links
