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
        Piwik?.getAsyncTracker()?.trackLink link, 'link'
    document.title = title
    false

audioBehaviors = (element) ->
    element.addEventListener 'play', (event) -> Piwik?.getAsyncTracker()?.trackEvent('Audio', 'Play', element.attr('data-title'), element.currentTime)
    element.addEventListener 'pause', (event) -> Piwik?.getAsyncTracker()?.trackEvent('Audio', 'Pause', element.attr('data-title'), element.currentTime)
    element.addEventListener 'seeked', (event) -> Piwik?.getAsyncTracker()?.trackEvent('Audio', 'Seeked', element.attr('data-title'), element.currentTime)
    element.addEventListener 'ended', (event) -> Piwik?.getAsyncTracker()?.trackEvent('Audio', 'Ended', element.attr('data-title'), element.currentTime)

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

audios = document.getElementsByTagName 'audio'
audioBehaviors audio for audio in audios
