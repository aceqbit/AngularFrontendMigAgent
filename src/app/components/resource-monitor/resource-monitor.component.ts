import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ResourceNode {
  id: string;
  status: 'active' | 'idle' | 'warning' | 'error';
  load: number;
  memory: number;
  uptime: number;
  processes: string[];
}

@Component({
  selector: 'app-resource-monitor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resource-monitor.component.html',
  styleUrls: ['./resource-monitor.component.css']
})
export class ResourceMonitorComponent implements OnInit, OnDestroy {
  nodes: ResourceNode[] = [];
  intervalId: any;
  
  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.initNodes();
    this.startSimulation();
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  initNodes() {
    for (let i = 0; i < 40; i++) {
      this.nodes.push({
        id: `NODE_${100 + i}`,
        status: 'active',
        load: Math.random() * 100,
        memory: Math.random() * 64,
        uptime: 0,
        processes: Array.from({ length: 5 }, (_, j) => `PROC_${i}_${j}`)
      });
    }
  }

  startSimulation() {
    this.intervalId = setInterval(() => {
      this.nodes.forEach(node => {
        node.load = Math.min(100, Math.max(0, node.load + (Math.random() * 20 - 10)));
        node.memory = Math.min(64, Math.max(2, node.memory + (Math.random() * 4 - 2)));
        node.uptime += 1;
        
        if (node.load > 90) node.status = 'error';
        else if (node.load > 75) node.status = 'warning';
        else if (node.load < 5) node.status = 'idle';
        else node.status = 'active';
      });
      // CRITICAL: Angular 18+ requires explicit change detection for setInterval mutations
      this.cdr.markForCheck();
    }, 1500);
  }

  getNodeColor(status: string): string {
    switch (status) {
      case 'error': return '#f43f5e';
      case 'warning': return '#f59e0b';
      case 'idle': return '#94a3b8';
      default: return '#10b981';
    }
  }
}
