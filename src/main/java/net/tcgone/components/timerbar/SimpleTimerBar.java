package net.tcgone.components.timerbar;

import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.HasSize;
import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.dependency.JsModule;
import com.vaadin.flow.component.dependency.NpmPackage;

@Tag("timer-bar")
@JsModule("./timer-bar.js")
@NpmPackage(value = "@polymer/polymer", version = "^3.0.1")
public class SimpleTimerBar extends Component implements HasSize {

  private static final String TIMER_SECONDS = "timerSeconds";
  private static final String SECONDS_REMAINING = "secondsRemaining";
  private static final String START_FUNCTION = "start";
  private static final String STOP_FUNCTION = "stop";
  private static final String RESET_FUNCTION = "reset";

  private long milliseconds;
  private long startedAtMilliseconds;

  public SimpleTimerBar() {
    this(10000);
  }

  public SimpleTimerBar(long milliseconds) {
    setMilliseconds(milliseconds);
  }

  private static double toSeconds(long milliseconds) {
    return milliseconds/1000;
  }

  public void setMilliseconds(long milliseconds) {
    this.milliseconds = milliseconds;
    getElement().setProperty(TIMER_SECONDS, toSeconds(milliseconds));
    getElement().setProperty(SECONDS_REMAINING, toSeconds(milliseconds));
  }

  public long getMilliseconds() {
    return milliseconds;
  }

  public long getMillisecondsRemaining() {
    long abs = milliseconds - (System.currentTimeMillis() - startedAtMilliseconds);
    return abs > 0 ? abs : 0;
  }

  public boolean isRunning() {
    long abs = milliseconds - (System.currentTimeMillis() - startedAtMilliseconds);
    return abs > 0;
  }

  public void start() {
    reset();
    startedAtMilliseconds = System.currentTimeMillis();
    getElement().callJsFunction(START_FUNCTION);
  }

  public void stop() {
    startedAtMilliseconds = 0;
    getElement().callJsFunction(STOP_FUNCTION);
  }

  public void reset() {
    stop();
    setMilliseconds(milliseconds);
    getElement().callJsFunction(RESET_FUNCTION);
  }

}
