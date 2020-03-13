import { getFocusable } from './focusable';

export interface TabtrapOptions {
	disableOnEscape?: boolean;
	/**
	 * The elements that should be tabbable inside of your `ReferenceElement`.
	 *
	 * Can be either a CSS selector, a `NodeList` of elements (what's returned by
	 * `.querySelectorAll`), or a function that takes the element and returns
	 */
	tabbableElements?:
	| string
	| NodeListOf<HTMLElement>
	| ((el: HTMLElement) => NodeListOf<HTMLElement>);
	/** Indicates whether tabbing should wrap around to be beginning/end. */
	wrap?: boolean;
}

const TabtrapInstances = new Set<Tabtrap>();

class Tabtrap {
	public enabled = false;
	public tabbable!: NodeListOf<HTMLElement>;

	protected constructor(
		public referenceElement: HTMLElement,
		public options: Required<TabtrapOptions>,
	) {
		this.referenceElement = referenceElement;
		this.options = options;

		TabtrapInstances.add(this);
	}

	public enable(): this {
		if (this.enabled) return this;

		const { tabbableElements } = this.options;
		switch (typeof tabbableElements) {
			case 'function':
				this.tabbable = tabbableElements(this.referenceElement);
				break;
			case 'string':
				this.tabbable = this.referenceElement.querySelectorAll<HTMLElement>(tabbableElements);
				break;
			default:
				this.tabbable = tabbableElements;
		}

		this.referenceElement.addEventListener('keydown', this.manageFocus);

		this.enabled = true;
		return this;
	}

	public disable(): this {
		if (!this.enabled) return this;

		this.enabled = false;
		return this;
	}

	public destroy(): void {
		if (this.enabled) this.disable();
		TabtrapInstances.delete(this);
	}

	private manageFocus = (e: KeyboardEvent): void => {
		if (!this.enabled) return;
		const { disableOnEscape, wrap } = this.options;

		if (e.key === 'Tab') {
			const tabIndex = Array.from(this.tabbable).indexOf(e.target as HTMLElement);
			const wrapForward = wrap && tabIndex === this.tabbable.length - 1 && !e.shiftKey;
			const wrapBackward = wrap && tabIndex === 0 && e.shiftKey;

			if (tabIndex < 0 || wrapForward) {
				e.preventDefault();
				this.tabbable[0].focus();
			}

			if (wrapBackward) {
				e.preventDefault();
				this.tabbable[this.tabbable.length - 1].focus();
			}
		}

		if (disableOnEscape && e.key === 'Escape') this.disable();
	}

	static create(
		referenceElement: HTMLElement,
		options?: TabtrapOptions,
	): Tabtrap {
		return new Tabtrap(
			referenceElement,
			{ ...Tabtrap.defaultOptions, ...options },
		);
	}

	static get instances(): Tabtrap[] {
		return Array.from(TabtrapInstances);
	}

	static defaultOptions: Required<TabtrapOptions> = {
		disableOnEscape: false,
		tabbableElements: getFocusable,
		wrap: true,
	}
}

export default Tabtrap;

export const trapFocus = (
	referenceElement: HTMLElement,
	options?: TabtrapOptions,
): Tabtrap => Tabtrap.create(referenceElement, options).enable();
