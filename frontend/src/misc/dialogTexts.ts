export type Dialog = {
  title: string
  buttonText: string
  text: string
  waitingMsg: string
  waitingText: string
  errorMsg: string
  successMsg: string
  succesTransaction: string
  hash: string
}

export const waitDialog: Dialog = {
  title: 'Claim',
  buttonText: 'Claim',
  text: 'you are withdrawing tokens from all the rounds’ pools.',
  waitingMsg: 'Waiting for transaction',
  waitingText: 'It will take some time for the transaction to be completed.',
  errorMsg: 'Error! Warning! An error has occured. Please try again.',
  successMsg: 'Congratulations! Your claim transaction is completed.',
  succesTransaction:
    'Transaction successfully completed. You can follow the information of your operation with the transaction hash:',
  hash: '',
}
