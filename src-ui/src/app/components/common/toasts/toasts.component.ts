import { Component, OnDestroy, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
import { Toast, ToastService } from 'src/app/services/toast.service'

@Component({
  selector: 'app-toasts',
  templateUrl: './toasts.component.html',
  styleUrls: ['./toasts.component.scss'],
})
export class ToastsComponent implements OnInit, OnDestroy {
  constructor(private toastService: ToastService) {}

  private subscription: Subscription

  public toasts: Toast[] = []

  public copied: boolean = false

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }

  ngOnInit(): void {
    this.subscription = this.toastService.getToasts().subscribe((toasts) => {
      this.toasts = toasts
      this.toasts.forEach((t) => {
        if (typeof t.error === 'string') {
          try {
            t.error = JSON.parse(t.error)
          } catch (e) {}
        }
      })
    })
  }

  public isDetailedError(error: any): boolean {
    return (
      typeof error === 'object' &&
      'status' in error &&
      'statusText' in error &&
      'url' in error &&
      'message' in error &&
      'error' in error
    )
  }

  public copyError(error: any) {
    navigator.clipboard.writeText(JSON.stringify(error))
    this.copied = true
    setTimeout(() => {
      this.copied = false
    }, 3000)
  }

  getErrorText(error: any) {
    const text: string = error.error?.detail ?? error.error ?? ''
    return `${text.slice(0, 200)}${text.length > 200 ? '...' : ''}`
  }
}
