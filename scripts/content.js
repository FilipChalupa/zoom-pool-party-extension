console.log('Pool party extension injected')
;(async () => {
	const hash = (s) =>
		s
			.split('')
			.reduce((a, b) => {
				a = (a << 5) - a + b.charCodeAt(0)
				return a & a
			}, 0)
			.toString(16)
			.replace('-', '0')

	const debounce = (f, timeout = 300) => {
		let timer
		return (...args) => {
			clearTimeout(timer)
			timer = setTimeout(() => {
				f.apply(this, args)
			}, timeout)
		}
	}

	let lastKnownParticipants = []

	const findParticipants = debounce(() => {
		const participants = Array.from(
			document.querySelectorAll('.participants-item-position'),
		).map((participant) => {
			const name = participant.querySelector(
				'.participants-item__display-name',
			).textContent
			const avatar = participant.querySelector('.participants-item__avatar')
			const id = (() => {
				let base = name
				if (avatar.tagName === 'IMG') {
					base += avatar.src
				} else {
					base += avatar.getAttribute('style') + avatar.textContent
				}
				return hash(base)
			})()

			return {
				id,
				name,
			}
		})
		const addParticipants = participants.filter(({ id }) =>
			lastKnownParticipants.every(({ id: id2 }) => id === id2),
		)
		const removeParticipants = lastKnownParticipants.filter(({ id }) =>
			participants.every(({ id: id2 }) => id === id2),
		)

		lastKnownParticipants = participants
		chrome.runtime.sendMessage({
			addParticipants,
			removeParticipants,
			participantsCount: participants.length,
		})
	})

	const loop = () => {
		findParticipants()
		setTimeout(loop, 1500)
	}

	chrome.runtime.sendMessage({ reset: true })
	setTimeout(loop, 3000)
})()
