import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

interface WidgetMetric {
  label: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  history: number[];
}

@Component({
  selector: 'app-dashboard-widgets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-widgets.component.html',
  styleUrls: ['./dashboard-widgets.component.css']
})
export class DashboardWidgetsComponent implements OnInit, OnDestroy {
  metrics: WidgetMetric[] = [];
  intervalId: any;
  
  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.initMetrics();
    this.startPolling();
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  initMetrics() {
    const labels = ['CPU LOAD', 'MEMORY USAGE', 'NETWORK IO', 'DISK LATENCY', 'DB CONNECTIONS', 'QUEUE DEPTH', 'CACHE RATIO', 'SSL HANDSHAKES'];
    labels.forEach(l => {
      this.metrics.push({
        label: l,
        value: Math.random() * 100,
        trend: 'stable',
        history: Array.from({ length: 20 }, () => Math.random() * 100)
      });
    });
  }

  startPolling() {
    this.intervalId = setInterval(() => {
      this.metrics.forEach(m => {
        const newValue = Math.random() * 100;
        m.trend = newValue > m.value ? 'up' : (newValue < m.value ? 'down' : 'stable');
        m.value = newValue;
        m.history.push(newValue);
        if (m.history.length > 20) m.history.shift();
      });
      // CRITICAL: Angular 18+ requires explicit change detection for setInterval mutations
      this.cdr.markForCheck();
    }, 1000);
  }

  getTrendIcon(trend: string): string {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  }
}
