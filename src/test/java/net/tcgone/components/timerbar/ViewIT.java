package net.tcgone.components.timerbar;

import org.junit.Assert;
import org.junit.Test;

import com.vaadin.testbench.TestBenchElement;

public class ViewIT extends AbstractViewTest {

    @Test
    public void componentWorks() {
        final TestBenchElement timerBar = $("timer-bar").first();
        // Check that paper-slider contains at least one other element, which means that
        // is has been upgraded to a custom element and not just rendered as an empty
        // tag
        Assert.assertTrue(
                timerBar.$(TestBenchElement.class).all().size() > 0);
    }
}
