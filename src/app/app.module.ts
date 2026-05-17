import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Components
import { LayoutManagerComponent } from './components/layout-manager/layout-manager.component';
import { DataGridComponent } from './components/data-grid/data-grid.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { WorkflowDesignerComponent } from './components/workflow-designer/workflow-designer.component';
import { StickyNotesComponent } from './components/sticky-notes/sticky-notes.component';
import { EventSchedulerComponent } from './components/event-scheduler/event-scheduler.component';
import { DateRangePickerComponent } from './components/date-range-picker/date-range-picker.component';
import { AutoCompleteComplexComponent } from './components/autocomplete-complex/autocomplete-complex.component';
import { FileExplorerComponent } from './components/file-explorer/file-explorer.component';
import { DashboardWidgetsComponent } from './components/dashboard-widgets/dashboard-widgets.component';
import { AdvancedFormStepperComponent } from './components/advanced-form-stepper/advanced-form-stepper.component';
import { TreeViewLargeComponent } from './components/tree-view-large/tree-view-large.component';
import { NotificationHubComponent } from './components/notification-hub/notification-hub.component';
import { SettingsPanelComponent } from './components/settings-panel/settings-panel.component';
import { ResourceMonitorComponent } from './components/resource-monitor/resource-monitor.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutManagerComponent,
    DataGridComponent,
    CalendarComponent,
    WorkflowDesignerComponent,
    StickyNotesComponent,
    EventSchedulerComponent,
    DateRangePickerComponent,
    AutoCompleteComplexComponent,
    FileExplorerComponent,
    DashboardWidgetsComponent,
    AdvancedFormStepperComponent,
    TreeViewLargeComponent,
    NotificationHubComponent,
    SettingsPanelComponent,
    ResourceMonitorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
