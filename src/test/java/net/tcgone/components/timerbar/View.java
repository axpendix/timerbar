package net.tcgone.components.timerbar;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.router.Route;

@Route("")
public class View extends Div {

    public View() {
        SimpleTimerBar simpleTimerBar = new SimpleTimerBar();
        simpleTimerBar.start();
        add(simpleTimerBar);

        add(new HorizontalLayout(new Button("Start", event -> {
            simpleTimerBar.start();
        }),new Button("Stop", event -> {
            simpleTimerBar.stop();
        }),new Button("Reset", event -> {
            simpleTimerBar.reset();
        }),new Button("Resize", event -> {
            simpleTimerBar.setWidth((50 + (Math.random() * 400))+"px");
        })));
    }
}
