//
//  ConfigFilesManager.swift
//  ClashX Safari Extension
//
//  Created by Ethan Mengoreo on 1/31/21.
//  Copyright © 2021 west2online. All rights reserved.
//

import Foundation

class ConfigFilesManager {
    static let shared = ConfigFilesManager()
    private var witness: Witness?
    private var pause = false
    
    func pauseForNextChange() {
        pause = true
    }

    func watchFile(path: String) {
        witness = Witness(paths: [path], flags: .FileEvents, latency: 0.3) {
            [weak self] events in
            guard let self = self else { return }
            guard !self.pause else {
                self.pause = false
                return
            }
            for event in events {
                if event.flags.contains(.ItemModified) || event.flags.contains(.ItemRenamed) {
                    NotificationCenter.default.post(.configFileChange)
                    break
                }
            }
        }
    }
    
    func stopWatchConfigFile() {
        witness = nil
        pause = false
    }

    @discardableResult
    static func backupAndRemoveConfigFile() -> Bool {
        let path = kDefaultConfigFilePath
        if FileManager.default.fileExists(atPath: path) {
            let newPath = "\(kConfigFolderPath)config_\(Date().timeIntervalSince1970).yaml"
            try? FileManager.default.moveItem(atPath: path, toPath: newPath)
        }
        return true
    }
    
}

extension Notification {
    static let configFileChange = Notification(name: Notification.Name("kConfigFileChange"))
}
