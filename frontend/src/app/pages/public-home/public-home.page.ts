import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import type { MapNode, PublicDeceasedDetail, PublicDeceasedSearchItem } from '@memoriar/shared';

import { SearchBarComponent } from '../../features/public-search/components/search-bar/search-bar.component';
import { ResultListComponent } from '../../features/public-search/components/result-list/result-list.component';
import { MapCanvasComponent } from '../../features/map/components/map-canvas/map-canvas.component';
import { BurialCaseDetailDrawerComponent } from '../../features/public-detail/components/burial-case-detail-drawer/burial-case-detail-drawer.component';
import { PublicSearchService } from '../../core/services/public-search.service';
import { MapService } from '../../core/services/map.service';

@Component({
  selector: 'mem-public-home-page',
  imports: [
    CommonModule,
    SearchBarComponent,
    ResultListComponent,
    MapCanvasComponent,
    BurialCaseDetailDrawerComponent
  ],
  templateUrl: './public-home.page.html',
  styleUrl: './public-home.page.css'
})
export class PublicHomePageComponent {
  protected readonly items = signal<PublicDeceasedSearchItem[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly selectedId = signal<string | null>(null);
  protected readonly detail = signal<PublicDeceasedDetail | null>(null);
  protected readonly hasSearched = signal(false);

  protected readonly cemeteryId = signal<string | null>(null);
  protected readonly loadedMapCemeteryId = signal<string | null>(null);
  protected readonly mapNodes = signal<MapNode[]>([]);
  protected readonly mapLoading = signal(false);
  protected readonly mapError = signal<string | null>(null);

  protected readonly selectedItem = computed(() => {
    const id = this.selectedId();
    if (!id) return null;
    return this.items().find((i) => i.burial_case_id === id) || null;
  });

  protected readonly highlightedMapNodeId = computed(() => {
    return this.selectedItem()?.map_node_id || null;
  });

  constructor(
    private readonly searchService: PublicSearchService,
    private readonly mapService: MapService
  ) {
    //
  }

  onSearch(query: { q: string }) {
    this.loading.set(true);
    this.error.set(null);
    this.selectedId.set(null);
    this.detail.set(null);
    this.hasSearched.set(true);
    this.items.set([]);
    this.mapNodes.set([]);
    this.loadedMapCemeteryId.set(null);
    this.mapLoading.set(false);
    this.mapError.set(null);

    const cemeteryId = this.cemeteryId() || undefined;
    this.searchService.search(query.q, cemeteryId).subscribe({
      next: (items) => {
        this.items.set(items);
        this.loading.set(false);

        const firstCemeteryId = items[0]?.cemetery_id || null;
        if (!this.cemeteryId() && firstCemeteryId) {
          this.cemeteryId.set(firstCemeteryId);
        }

        if (items.length) {
          this.onSelect(items[0].burial_case_id);
          return;
        }

        this.mapNodes.set([]);
        this.loadedMapCemeteryId.set(this.cemeteryId());
      },
      error: () => {
        this.error.set('Não foi possível buscar agora. Tente novamente.');
        this.loading.set(false);
      }
    });
  }

  onSelect(burialCaseId: string) {
    this.selectedId.set(burialCaseId);
    this.detail.set(null);
    const item = this.items().find((i) => i.burial_case_id === burialCaseId) || null;
    if (item?.cemetery_id && this.cemeteryId() !== item.cemetery_id) {
      this.cemeteryId.set(item.cemetery_id);
    }

    this.ensureMapNodesLoaded();
    this.searchService.getCaseDetail(burialCaseId).subscribe({
      next: (d) => this.detail.set(d),
      error: () => this.error.set('Não foi possível carregar o detalhe agora.')
    });
  }

  onCloseDrawer() {
    this.selectedId.set(null);
    this.detail.set(null);
  }

  onMapNodeSelected(mapNodeId: string) {
    const item = this.items().find((i) => i.map_node_id === mapNodeId) || null;
    if (!item) return;
    this.onSelect(item.burial_case_id);
  }

  private ensureMapNodesLoaded() {
    const cemeteryId = this.cemeteryId();
    if (!cemeteryId) return;
    if (this.loadedMapCemeteryId() === cemeteryId) return;

    this.mapLoading.set(true);
    this.mapError.set(null);
    this.mapNodes.set([]);
    this.mapService.getMapNodes(cemeteryId).subscribe({
      next: (nodes) => {
        this.mapNodes.set(nodes);
        this.loadedMapCemeteryId.set(cemeteryId);
        this.mapLoading.set(false);
      },
      error: () => {
        this.loadedMapCemeteryId.set(null);
        this.mapNodes.set([]);
        this.mapError.set('Não foi possível carregar o mapa agora.');
        this.mapLoading.set(false);
      }
    });
  }
}
