package com.example.demo;

import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * A sample Java class demonstrating various syntax elements
 * for VS Code theme preview.
 *
 * @author Claude Theme Demo
 * @version 1.0
 */
public class Sample {

    // Constants
    private static final String APP_NAME = "Theme Preview";
    private static final int MAX_RETRIES = 3;
    private static final double PI = 3.14159265358979;

    // Instance fields
    private String name;
    private int count;
    private boolean isActive;
    private List<String> items;

    /**
     * Enum representing task status.
     */
    public enum Status {
        PENDING, IN_PROGRESS, COMPLETED, FAILED;

        public boolean isTerminal() {
            return this == COMPLETED || this == FAILED;
        }
    }

    /**
     * Constructor with parameters.
     *
     * @param name the name of the sample
     * @param count initial count value
     */
    public Sample(String name, int count) {
        this.name = name;
        this.count = count;
        this.isActive = true;
        this.items = new ArrayList<>();
    }

    /**
     * Generic method demonstrating type parameters.
     */
    public <T extends Comparable<T>> T findMax(List<T> list) {
        if (list == null || list.isEmpty()) {
            throw new IllegalArgumentException("List must not be null or empty");
        }
        T max = list.get(0);
        for (T item : list) {
            if (item.compareTo(max) > 0) {
                max = item;
            }
        }
        return max;
    }

    /**
     * Process items with streams and lambdas.
     */
    public List<String> processItems() {
        return items.stream()
                .filter(item -> item != null && !item.isEmpty())
                .map(String::toUpperCase)
                .sorted()
                .collect(Collectors.toList());
    }

    /**
     * Demonstrates control flow and exception handling.
     */
    public String execute(int input) {
        String result;

        // Switch expression (Java 14+)
        result = switch (input) {
            case 1 -> "one";
            case 2 -> "two";
            case 3 -> "three";
            default -> {
                if (input > 100) {
                    yield "large number: " + input;
                } else {
                    yield "number: " + input;
                }
            }
        };

        // Try-catch with multiple exception types
        try {
            for (int i = 0; i < MAX_RETRIES; i++) {
                if (i == input) {
                    throw new RuntimeException("Match found at index " + i);
                }
            }
        } catch (RuntimeException | IllegalStateException e) {
            System.err.println("Error: " + e.getMessage());
        } finally {
            System.out.println("Execution complete");
        }

        return result;
    }

    /**
     * Inner interface for callbacks.
     */
    @FunctionalInterface
    public interface Callback<T> {
        void onComplete(T result);
    }

    /**
     * Record class (Java 16+).
     */
    public record Point(double x, double y) {
        public double distanceTo(Point other) {
            double dx = this.x - other.x;
            double dy = this.y - other.y;
            return Math.sqrt(dx * dx + dy * dy);
        }
    }

    // Getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getCount() { return count; }
    public boolean isActive() { return isActive; }

    @Override
    public String toString() {
        return "Sample{name='%s', count=%d, active=%b}".formatted(name, count, isActive);
    }

    public static void main(String[] args) {
        var sample = new Sample("Demo", 42);
        sample.items.addAll(List.of("hello", "world", "java", "theme"));

        System.out.println(sample);
        System.out.println("Processed: " + sample.processItems());
        System.out.println("Result: " + sample.execute(2));

        var p1 = new Point(0, 0);
        var p2 = new Point(3, 4);
        System.out.printf("Distance: %.2f%n", p1.distanceTo(p2));
    }
}