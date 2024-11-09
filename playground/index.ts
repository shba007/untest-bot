import consola from 'consola'
import { answerKeyComparator } from '../src'

consola.log(await answerKeyComparator('answer-key-1-answer.jpg', 'answer-key-1-check-5.jpg'))
