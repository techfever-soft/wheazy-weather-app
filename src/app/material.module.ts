import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule} from '@angular/material/chips';
import { MatSnackBarModule} from '@angular/material/snack-bar';

import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  imports: [
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatSelectModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    DragDropModule,
    MatToolbarModule,
    MatExpansionModule,
    MatSliderModule,
    MatTooltipModule,
    MatRippleModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatChipsModule,MatSnackBarModule
  ],
  exports: [
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatSelectModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    DragDropModule,
    MatToolbarModule,
    MatExpansionModule,
    MatSliderModule,
    MatTooltipModule,
    MatRippleModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatChipsModule,MatSnackBarModule
  ],
})
export class MaterialModule {}
