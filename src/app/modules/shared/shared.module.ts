import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { MaterialModule } from './material.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DialogConfirmComponent } from './components/dialog-confirm/dialog-confirm.component';
import { ThemeSwitcherComponent } from './components/theme-switcher/theme-switcher.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    SidenavComponent,
    DialogConfirmComponent,
    ThemeSwitcherComponent,
    FooterComponent
  ],
  exports: [
    SidenavComponent,
    ThemeSwitcherComponent,
    DialogConfirmComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    MaterialModule,
    FormsModule,
    HttpClientModule
  ]
})
export class SharedModule { }
