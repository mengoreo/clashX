//
//  SafariWebExtensionHandler.swift
//  ClashX Safari Extension
//
//  Created by Ethan Mengoreo on 12/13/20.
//  Copyright © 2020 west2online. All rights reserved.
//

import SafariServices
import os.log

//let SFExtensionMessageKey = "message"

class SafariWebExtensionHandler: NSObject, NSExtensionRequestHandling {

	func beginRequest(with context: NSExtensionContext) {
        let item = context.inputItems[0] as? NSExtensionItem
        let message = item?.userInfo?[SFExtensionMessageKey]
        print("Received message from browser.runtime.sendNativeMessage: ", message as Any)

        let response = NSExtensionItem()
        response.userInfo = [ SFExtensionMessageKey: [ "Response to": message ] ]

        context.completeRequest(returningItems: [response], completionHandler: nil)
    }
    
}

fileprivate extension String {
    static let sfExtensionResponseKey = ""
}
