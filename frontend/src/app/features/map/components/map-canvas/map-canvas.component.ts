import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { MapNode } from '@memoriar/shared';

type MapNodeVm = {
  id: string;
  label: string;
  left: number;
  top: number;
  width: number;
  height: number;
};

@Component({
  selector: 'mem-map-canvas',
  imports: [CommonModule],
  templateUrl: './map-canvas.component.html',
  styleUrl: './map-canvas.component.css'
})
export class MapCanvasComponent {
  @Input({ required: true }) nodes: MapNode[] = [];
  @Input({ required: true }) highlightedNodeId: string | null = null;
  @Input({ required: true }) active = false;
  @Input({ required: true }) loading = false;
  @Input({ required: true }) error: string | null = null;
  @Output() nodeSelected = new EventEmitter<string>();

  get vmNodes(): MapNodeVm[] {
    return this.nodes
      .filter((n) => n.w > 0 && n.h > 0)
      .map((n) => ({
        id: n.id,
        label: n.label || n.node_type,
        left: n.x,
        top: n.y,
        width: n.w,
        height: n.h
      }));
  }
}
