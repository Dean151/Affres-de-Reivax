---
---

piwik = Piwik?.getAsyncTracker()

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
        piwik?.trackLink link, 'link'
    document.title = title
    false

downloadBehavior = (event) ->
    link = this.getAttribute 'href'
    piwik?.trackLink link, 'download'
    true

audioBehaviors = (element) ->
    element.addEventListener 'play', (event) -> piwik?.trackEvent('Audio', 'Play', element.src, element.currentTime)
    element.addEventListener 'pause', (event) -> piwik?.trackEvent('Audio', 'Pause', element.src, element.currentTime)
    element.addEventListener 'seeked', (event) -> piwik?.trackEvent('Audio', 'Seeked', element.src, element.currentTime)
    element.addEventListener 'ended', (event) -> piwik?.trackEvent('Audio', 'Ended', element.src, element.currentTime)

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

downloads = document.getElementsByClassName 'download-link'
download.addEventListener 'click', downloadBehavior for download in downloads

audios = document.getElementsByTagName 'audio'
audioBehaviors audio for audio in audios
