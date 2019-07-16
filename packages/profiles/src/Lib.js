export const printHello = () => {
  console.log('Hello im imported library')
}

/*export const AskUse3Box = livepeerSpace => {
	return (
		<div
			style={{
				textAlign: 'center',
			}}
		>
			<h2>Use existing profile?</h2>
			We recognize you already have a 3box profile.
			<br />
			Use it on Livepeer?
			<div
				style={{
					marginTop: '20px',
				}}
			>
				<Button>Create new</Button>
				<Button
					onClick={() => {
						setContent(EmptyProfile)
						setPopupOpen(false)
						console.log(livepeerSpace)
						livepeerSpace.public.set('defaultProfile', '3box')
					}}
				>
					Use existing
				</Button>
			</div>
		</div>
	)
}*/
