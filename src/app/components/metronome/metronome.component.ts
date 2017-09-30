import {Component, EventEmitter, OnInit} from '@angular/core';
import {Metronome} from '../../lib/metronome';
import {Bus} from '../../lib/Bus';
import {AudioListener} from '../../domain/listeners/audioListener';
import ResolutionOptions from '../../domain/entities/resolutionOptions';

@Component({
  selector: 'metronome',
  templateUrl: './metronome.component.template.html',
  providers: [AudioListener, Metronome, Bus]
})
export class MetronomeComponent implements OnInit {
  private _gainAmount = 5;
  private _tempoAmount = 5;

  public tempo: number;
  public isPlaying: boolean;
  public selectedResolutionId: number;
  public gain = 100;
  public resolutionOptions = ResolutionOptions;
  public tempoChange = new EventEmitter();
  public isPlayingChange = new EventEmitter();
  public gainChange = new EventEmitter();

  constructor(private metronome: Metronome,
              private audioListener: AudioListener,
              private bus: Bus) {
  }

  ngOnInit(): void {
    this.tempo = this.metronome.tempo;
    this.selectedResolutionId = this.resolutionOptions[0].id;
  }

  public togglePlaying(): void {
    this.isPlaying = !this.isPlaying;
    this.isPlayingChange.next(this.isPlaying);
    this.metronome.play();
  }

  public changeResolution(resolutionId: number) {
    const resolution = this.resolutionOptions.find(x => x.id === Number(resolutionId));
    this.selectedResolutionId = resolutionId;

    this.metronome.changeResolution(resolution);
  }

  public increaseTempo() {
    this.changeTempoValue(this._tempoAmount);
  }

  public decreaseTempo() {
    this.changeTempoValue(-this._tempoAmount);
  }

  public increaseGain() {
    this.changeGainValue(this._gainAmount);
  }

  public decreaseGain() {
    this.changeGainValue(-this._gainAmount);
  }

  private changeTempoValue(tempoAmount: number) {
    if ((this.tempo === 30 && tempoAmount < 1) || (this.tempo === 250 && tempoAmount > 1)) {
      return;
    }

    this.tempo += tempoAmount;
    this.tempoChange.next(this.tempo);
    this.metronome.changeTempo(tempoAmount);
  }

  private changeGainValue(amount: number) {
    if ((this.gain === 0 && amount < 1) || (this.gain === 100 && amount > 1)) {
      return;
    }

    this.gain += amount;
    this.gainChange.next(this.gain);

    this.bus.gainChannel.next(amount);
  }
}