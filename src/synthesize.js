module.exports = actionHash => {
	const errors = []
	const _synth = tree => {
		if (tree.error) {
			errors.push(tree)
			return null
		}
		return 'value' in tree ? tree.value : actionHash[tree.type](...tree.content.map(_synth))
	}
	return tree => [_synth(tree), errors]
}
