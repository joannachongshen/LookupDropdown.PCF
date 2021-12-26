/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-tabs */
/* eslint-disable no-undef */
import { IInputs, IOutputs } from './generated/ManifestTypes'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import LookupDropdownApp from './components/LookupDropdownApp'
import { IPcfContextServiceProps } from './services/PcfContextService'
import { initializeIcons } from '@fluentui/react/lib/Icons'

initializeIcons(undefined, { disableWarnings: true })

export class LookupDropdown implements ComponentFramework.StandardControl<IInputs, IOutputs> {
	private _notifyOutputChanged:() => void;
	private _container: HTMLDivElement;
	private _selectedValue: ComponentFramework.LookupValue[] | undefined;
	private _appprops:IPcfContextServiceProps;

	/**
	 * Empty constructor.
	 */
	constructor () {

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init (context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement): void {
	  // Add control initialization code
	  this._notifyOutputChanged = notifyOutputChanged
	  this._container = document.createElement('div')

	  this._appprops = {
	    selectedValue: undefined,
	    context: context,
	    instanceid: Date.now().toString(),
	    onChange: this.onChange
	  }
	  container.appendChild(this._container)
	}

	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView (context: ComponentFramework.Context<IInputs>): void {
	  // Add code to update control view
	  this._appprops.selectedValue = context.parameters.lookupfield.raw[0] ?? undefined

	  // RENDER React Component
	  ReactDOM.render(
	    React.createElement(LookupDropdownApp, this._appprops),
	    this._container
	  )
	}

	onChange = (newValue: ComponentFramework.LookupValue[] | undefined): void => {
	  this._selectedValue = newValue
	  this._notifyOutputChanged()
	};

	/**
	 * It is called by the framework prior to a control receiving new data.
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs (): IOutputs {
	  return {
		  lookupfield: this._selectedValue
	  }
	}

	/**
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy (): void {
	  // Add code to cleanup control if necessary
	  ReactDOM.unmountComponentAtNode(this._container)
	}
}
