const debounce = (f, timeout = 300) => {
	let timer
	return (...args) => {
		clearTimeout(timer)
		timer = setTimeout(() => {
			f.apply(this, args)
		}, timeout)
	}
}

const findNames = debounce(() => {
	const names = Array.from(
		document.querySelectorAll('.participants-item__display-name'),
	).map((name) => name.textContent)
	console.log(names)
	chrome.runtime.sendMessage({ participantsCount: names.length })
})

const observer = new MutationObserver((mutationsList) => {
	mutationsList.forEach((mutation) => {
		mutation.addedNodes.forEach(() => {
			findNames()
		})
	})
})

// @TODO: maybe use setInterval/Timeout too
observer.observe(document, { subtree: true, childList: true })
