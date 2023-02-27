const getFileName = () => new Error().stack.match(/(\w+\.js):/)[1]
console.log(`Welcome to ${getFileName()}!`)

// songs
const imagine = ['c', 'cmaj7', 'f', 'am', 'dm', 'g', 'e7']
const somewhereOverTheRainBow = ['c', 'em', 'f', 'g', 'am']
const tooManyCooks = ['c', 'g', 'f']
const iWillFollowYouIntoTheDark = ['f', 'dm', 'bb', 'c', 'a', 'bbm']
const babyOneMoreTime = ['cm', 'g', 'bb', 'eb', 'fm', 'ab']
const creep = ['g', 'gsus4', 'b', 'bsus4', 'c', 'cmsus4', 'cm6']
const paperBag = [
  'bm7',
  'e',
  'c',
  'g',
  'b7',
  'f',
  'em',
  'a',
  'cmaj7',
  'em7',
  'a7',
  'f7',
  'b',
]
const toxic = ['cm', 'eb', 'g', 'cdim', 'eb7', 'd7', 'db7', 'ab', 'gmaj7', 'g7']
const bulletproof = ['d#m', 'g#', 'b', 'f#', 'g#m', 'c#']
const songs = []
const allChords = new Set()
const labelCounts = new Map()
const labelProbabilities = new Map()
const chordCountsInLabels = new Map()
let probabilityOfChordsInLabels = new Map()
const EASY = 'easy'
const MEDIUM = 'medium'
const HARD = 'hard'

const train = (chords, label) => {
  songs.push({ label, chords })
  chords.forEach((chord) => allChords.add(chord))
  labelCounts.set(label, (labelCounts.get(label) || 0) + 1)
}

const setLabelProbabilities = () =>
  labelCounts.forEach((_count, label) =>
    labelProbabilities.set(label, labelCounts.get(label) / songs.length)
  )

const setChordCountsInLabels = () => {
  songs.forEach(function ({ label, chords }) {
    if (!chordCountsInLabels.get(label)) {
      chordCountsInLabels.set(label, {})
    }
    chords.forEach((chord) =>
      chordCountsInLabels.set(label, {
        ...chordCountsInLabels.get(label),
        [chord]: (chordCountsInLabels.get(label)[chord] || 0) + 1,
      })
    )
  })
}
function setProbabilityOfChordsInLabels() {
  probabilityOfChordsInLabels = chordCountsInLabels
  probabilityOfChordsInLabels.forEach(function (_count, difficulty) {
    Object.keys(probabilityOfChordsInLabels.get(difficulty)).forEach(function (
      chord
    ) {
      probabilityOfChordsInLabels.get(difficulty)[chord] /= songs.length
    })
  })
}
train(imagine, EASY)
train(somewhereOverTheRainBow, EASY)
train(tooManyCooks, EASY)
train(iWillFollowYouIntoTheDark, MEDIUM)
train(babyOneMoreTime, MEDIUM)
train(creep, MEDIUM)
train(paperBag, HARD)
train(toxic, HARD)
train(bulletproof, HARD)
setLabelProbabilities()
setChordCountsInLabels()
setProbabilityOfChordsInLabels()
function classify(chords) {
  const smoothing = 1.01
  console.log(labelProbabilities)
  const classified = new Map()
  labelProbabilities.forEach(function (_count, difficulty) {
    let first = labelProbabilities.get(difficulty) + smoothing
    chords.forEach(function (chord) {
      const probabilityOfChordInLabel =
        probabilityOfChordsInLabels.get(difficulty)[chord]
      if (probabilityOfChordInLabel) {
        first = first * (probabilityOfChordInLabel + smoothing)
      }
    })
    classified.set(difficulty, first)
  })
  console.log(classified)
}
classify(['d', 'g', 'e', 'dm'])
classify(['f#m7', 'a', 'dadd9', 'dmaj7', 'bm', 'bm7', 'd', 'f#m'])
