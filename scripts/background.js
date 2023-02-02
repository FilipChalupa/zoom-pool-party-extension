chrome.runtime.onMessage.addListener((request) => {
	if ('participantsCount' in request) {
		chrome.action.setBadgeText({
			text: request.participantsCount.toString(),
		})
	}
})
