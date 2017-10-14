import {NoteResolution} from './noteResolution';
import {AccentType} from './accentType';

export class Setup {
  private steps: Array<Setup> = [];
  private tempoModifier: number;

  accentType: AccentType;

  constructor(public tempo: number,
              public noteResolution: NoteResolution,
              public beats?: number) {
    this.beats = beats || 1;
  }

  getNextSetup(tempoModifier: number = 1): Setup {
    if (this.steps.length === 0) {
      this.steps = this.makeSetups();
    }

    const setup = this.steps.shift();
    setup.tempoModifier = tempoModifier;
    return setup;
  }

  hasNextSetup(): boolean {
    return this.steps.length !== 0;
  }

  getStepInMS(): number {
    const noteResolution = this.noteResolution;
    const millisecondsPerBeat = 60 / this.tempo;
    return (millisecondsPerBeat * noteResolution.duration) * (noteResolution.isTriplet ? 0.67 : 1) / this.tempoModifier;
  }

  private getNumberOfSteps(): number {
    return this.beats * this.noteResolution.beatMultiplier;
  }

  private makeSetups(): Array<Setup> {
    const steps = [];
    for (let i = 0; i < this.getNumberOfSteps(); i++) {
      const accentType = i % this.noteResolution.beatMultiplier === 0 ? AccentType.BEAT_HEAD : AccentType.SUB_BEAT;
      const p = new Setup(this.tempo, this.noteResolution, this.beats);
      p.accentType = accentType;

      steps.push(p);
    }

    return steps;
  }
}
