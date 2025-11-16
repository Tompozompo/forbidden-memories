/**
 * MusicPlayer - Generates and plays a simple Yu-Gi-Oh themed background music
 * using the Web Audio API. This creates a synthesized melody that loops continuously.
 */

class MusicPlayer {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying = false;
  private currentSourceNodes: OscillatorNode[] = [];
  private loopTimeout: number | null = null;

  // Melody notes in Hz (based on a simple, mysterious Yu-Gi-Oh style theme)
  // Using pentatonic scale for that mystical vibe
  private readonly melody = [
    { freq: 329.63, duration: 0.4 },  // E4
    { freq: 392.00, duration: 0.4 },  // G4
    { freq: 440.00, duration: 0.4 },  // A4
    { freq: 523.25, duration: 0.6 },  // C5
    { freq: 440.00, duration: 0.4 },  // A4
    { freq: 392.00, duration: 0.4 },  // G4
    { freq: 329.63, duration: 0.8 },  // E4
    { freq: 0, duration: 0.2 },       // Rest
    { freq: 293.66, duration: 0.4 },  // D4
    { freq: 329.63, duration: 0.4 },  // E4
    { freq: 392.00, duration: 0.6 },  // G4
    { freq: 329.63, duration: 0.4 },  // E4
    { freq: 293.66, duration: 0.8 },  // D4
    { freq: 0, duration: 0.4 },       // Rest
  ];

  // Bass line to accompany the melody
  private readonly bass = [
    { freq: 82.41, duration: 1.6 },   // E2
    { freq: 98.00, duration: 1.6 },   // G2
    { freq: 110.00, duration: 1.6 },  // A2
    { freq: 73.42, duration: 1.6 },   // D2
  ];

  /**
   * Initialize the audio context and gain node
   */
  private async init() {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
    }
    
    // Resume audio context if it's suspended (browser autoplay policy)
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  /**
   * Play a single note with attack-decay-sustain-release envelope
   */
  private playNote(frequency: number, startTime: number, duration: number, volume: number, isBass = false) {
    if (!this.audioContext || !this.gainNode || frequency === 0) return;

    const oscillator = this.audioContext.createOscillator();
    const noteGain = this.audioContext.createGain();

    // Use triangle wave for melody, sine for bass
    oscillator.type = isBass ? 'sine' : 'triangle';
    oscillator.frequency.setValueAtTime(frequency, startTime);

    // ADSR envelope
    const attackTime = 0.05;
    const decayTime = 0.1;
    const sustainLevel = isBass ? 0.3 : 0.4;
    const releaseTime = 0.1;

    const noteVolume = volume * (isBass ? 0.4 : 0.6);

    noteGain.gain.setValueAtTime(0, startTime);
    noteGain.gain.linearRampToValueAtTime(noteVolume, startTime + attackTime);
    noteGain.gain.linearRampToValueAtTime(noteVolume * sustainLevel, startTime + attackTime + decayTime);
    noteGain.gain.setValueAtTime(noteVolume * sustainLevel, startTime + duration - releaseTime);
    noteGain.gain.linearRampToValueAtTime(0, startTime + duration);

    oscillator.connect(noteGain);
    noteGain.connect(this.gainNode);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);

    this.currentSourceNodes.push(oscillator);
  }

  /**
   * Play the complete melody loop
   */
  private playMelodyLoop(volume: number) {
    if (!this.audioContext || !this.isPlaying) return;

    const startTime = this.audioContext.currentTime;
    let melodyTime = startTime;
    let bassTime = startTime;

    // Play melody
    this.melody.forEach(note => {
      this.playNote(note.freq, melodyTime, note.duration, volume, false);
      melodyTime += note.duration;
    });

    // Play bass line
    this.bass.forEach(note => {
      this.playNote(note.freq, bassTime, note.duration, volume, true);
      bassTime += note.duration;
    });

    // Calculate total duration and schedule next loop
    const totalDuration = Math.max(
      this.melody.reduce((sum, note) => sum + note.duration, 0),
      this.bass.reduce((sum, note) => sum + note.duration, 0)
    );

    // Schedule next loop
    this.loopTimeout = window.setTimeout(() => {
      this.playMelodyLoop(volume);
    }, totalDuration * 1000);
  }

  /**
   * Start playing the background music
   */
  async start(volume: number = 0.5) {
    if (this.isPlaying) return;

    await this.init();
    
    this.isPlaying = true;
    this.setVolume(volume);
    this.playMelodyLoop(volume);
  }

  /**
   * Stop playing the background music
   */
  stop() {
    this.isPlaying = false;

    // Clear the loop timeout
    if (this.loopTimeout !== null) {
      clearTimeout(this.loopTimeout);
      this.loopTimeout = null;
    }

    // Stop all currently playing oscillators
    this.currentSourceNodes.forEach(node => {
      try {
        node.stop();
      } catch (e) {
        // Ignore errors if already stopped
      }
    });
    this.currentSourceNodes = [];
  }

  /**
   * Set the volume (0 to 1)
   */
  setVolume(volume: number) {
    if (this.gainNode) {
      this.gainNode.gain.setValueAtTime(volume, this.audioContext?.currentTime || 0);
    }
  }

  /**
   * Check if music is currently playing
   */
  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Clean up resources
   */
  dispose() {
    this.stop();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.gainNode = null;
  }
}

// Export a singleton instance
export const musicPlayer = new MusicPlayer();
