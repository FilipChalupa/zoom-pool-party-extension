import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js'
import {
	deleteDoc,
	doc,
	getFirestore,
	setDoc,
} from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js'

const firebaseConfig = {
	apiKey: 'AIzaSyCk-rS-4QmPAXIBE2xIbPBYDzxjqp5Gc1A',
	authDomain: 'zoom-pool-party.firebaseapp.com',
	projectId: 'zoom-pool-party',
	storageBucket: 'zoom-pool-party.appspot.com',
	messagingSenderId: '225593866133',
	appId: '1:225593866133:web:f1c463dfa3c526f762689c',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
console.log(db)

const poolId = 'RGGAKI4GcohaIXbaSs3v' // @TODO: get from popup
//const participantsRef = collection(db, "pools", poolId, "participants");

chrome.runtime.onMessage.addListener(async (request) => {
	if ('participantsCount' in request) {
		chrome.action.setBadgeText({
			text: request.participantsCount.toString(),
		})
	}
	if ('reset' in request && request.reset) {
		console.log('Reset')
		const docRef = doc(db, 'pools', poolId)
		await deleteDoc(docRef)
	}
	if ('addParticipants' in request && request.addParticipants.length > 0) {
		console.log('Add participants')
		console.log(request.addParticipants)
		// @TODO: batching
		for (const participant of request.addParticipants) {
			const docRef = doc(db, 'pools', poolId, 'participants', participant.id)
			await setDoc(docRef, {
				name: participant.name,
			})
		}
	}
	if (
		'removeParticipants' in request &&
		request.removeParticipants.length > 0
	) {
		console.log('Remove participants')
		console.log(request.removeParticipants)
		// @TODO: batching
		for (const { id } of request.removeParticipants) {
			const docRef = doc(db, 'pools', poolId, 'participants', id)
			await deleteDoc(docRef)
		}
	}
})
