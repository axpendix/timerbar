/**
 * `timer-bar`
 * A bar that represents a timer counting down.
 *
 * ### Example
 *
 * ```html
 * <timer-bar timer-seconds="30" is-running="true"></timer-bar>
 * ```
 *
 * ### Styling
 *
 * The following custom CSS properties are available
 *
 * Property | Description
 * -------------|-------------
 * `--timer-bar-width` | The width of this element, including the bar and timer
 * `--timer-bar-max-width` | The maximum width of this element
 * `--timer-bar-font-size` | The font size for the timer
 * `--timer-bar-height` | The height of the timer bar
 * `--timer-bar-background-color` | The background color of the bar
 * `--timer-bar-foreground-color` | The foreground color of the bar, i.e. the time remaining
 * `--timer-bar-timer-width` | The width of the timer
 * `--timer-bar-timer-padding` | The padding of the timer
 *
 * ### Properties
 *
 * The following properties are available (isRunning and timerSeconds are reflected to attributes)
 *
 * Property | Default | Description
 * -------------|-------------|-------------
 * `timerVisible` | true | If true, shows the timer
 * `barVisible` | true | If true, shows the timer bar
 * `isRunning` | false | If true, counts down the timer
 * `timerSeconds` | 10 | The number of seconds to count down from
 * `secondsRemaining` | 10 | The number of seconds remaining.
 *
 * ### Methods
 *
 * The following methods are available
 *
 * Method | Description
 * -------------|-------------
 * `reset()` | Resets `secondsRemaining` to `timerSeconds`
 * `start()` | Sets `isRunning` to true
 * `stop()` | Sets `isRunning` to false
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
 
import {PolymerElement,html} from '@polymer/polymer/polymer-element.js';

class TimerBar extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: flex;
          align-items: center;
          box-sizing: border-box;
          margin: var(--timer-bar-margin, 8px);
          width: var(--timer-bar-width, 100%);
          max-width: var(--timer-bar-max-width, 300px);
          font: var(--timer-bar-font-size, 1.2rem "Helvetica Neue", Helvetica, sans-serif);
          @apply --timer-bar-theme;
        }
        #bar {
          position: relative;
          width: 100%;
          height: var(--timer-bar-height, 24px);
          background: var(--timer-bar-background-color, #eaeaea);
        }
        #progress {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          background: var(--timer-bar-foreground-color, #ff503a);
        }
        #timer {
          width: var(--timer-bar-timer-width, 50px);
          padding: var(--timer-bar-timer-padding, 0 0 0 12px);
        }
      </style>

      <div id="bar">
        <div id="progress"></div>
      </div>

      <div id="timer">[[timer]]</div>
      `;
  }
  static get is() { return 'timer-bar'; }
  static get properties() {
    return {
      timerVisible: {
        type: Boolean,
        value: true,
        observer: '_timerVisibleChanged'
      },
      barVisible: {
        type: Boolean,
        value: true,
        observer: '_barVisibleChanged'
      },
      isRunning: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        observer: '_isRunningChanged'
      },
      timerSeconds: {
        type: Number,
        value: 10,
        reflectToAttribute: true,
        observer: '_timerSecondsChanged'
      },
      secondsRemaining: {
        type: Number
      },
      timer: {
        type: String,
        value: '0',
        computed: '_computeTimer(secondsRemaining)'
      }
    };
  }
  _timerSecondsChanged(newVal) {
    this.secondsRemaining = newVal;
    this._updateBar();
  }
  _timerVisibleChanged(newValue) {
    if(newValue) {
      this.$.timer.style.display = "inline-block";
    } else {
      this.$.timer.style.display = "none";
    }
  }
  _barVisibleChanged(newValue) {
    if(newValue) {
      this.$.bar.style.display = "inline-block";
    } else {
      this.$.bar.style.display = "none";
    }
  }
  _computeTimer(secondsRemaining) {
    // For numbers less than 10, we want to always show one decimal (i.e. 6.0, not 6)
    // but also floored (9.99 -> 9.9, not 10)
    return secondsRemaining >= 10 ? Math.floor(secondsRemaining) :
      (Math.floor(secondsRemaining * 10) / 10).toFixed(1);
  }
  _isRunningChanged(newValue) {
    if(newValue) {
      this.animation = requestAnimationFrame(this._updateBarWidth.bind(this));
    } else if (this.animation !== undefined) {
      cancelAnimationFrame(this.animation);
      delete this.lastUpdate;
    }
  }
  _updateBarWidth(timestamp) {
    if(this.lastUpdate === undefined) {
      this.lastUpdate = timestamp;
    }

    this.secondsRemaining -= (timestamp - this.lastUpdate)/1000;
    this.lastUpdate = timestamp;

    if(this.secondsRemaining < 0) {
      this.secondsRemaining = 0;
      this.isRunning = false;
      this._notifyEnded();
    }
    this._updateBar();

    if(this.isRunning) {
      this.animation = requestAnimationFrame(this._updateBarWidth.bind(this));
    }
  }
  _updateBar() {
    let percentage = this.timerSeconds === 0 ? 0 : this.secondsRemaining/this.timerSeconds*100;
    this.$.progress.style.width = `${percentage}%`;
  }
  _notifyEnded() {
    this.dispatchEvent(new CustomEvent('timer-end'));
  }

  /**
   * Starts the timer
   */
  start() {
    this.isRunning = true;
  }

  /**
   * Pauses the timer
   */
  stop() {
    this.isRunning = false;
  }

  /**
   * Pauses and ends the timer
   */
  end() {
    this.stop();
    this.secondsRemaining = 0;
    this._updateBar();
    this._notifyEnded();
  }

  /**
   * Resets the timer without changing the running state
   */
  reset() {
    this._timerSecondsChanged(this.timerSeconds);
  }
}

customElements.define(TimerBar.is, TimerBar);
