INSERT INTO user (username, email) VALUES ('john_doe', 'john@example.com');
INSERT INTO user (username, email) VALUES ('jane_doe', 'jane@example.com');

-- Use owner_id (foreign key to user_login_details.email) instead of owner_email
INSERT INTO projects (
  id,
  name,
  owner_id,
  diagram_type,
  diagram_json,
  created_at,
  updated_at
) VALUES (
  1,
  'Sample Project',
  'mo@gmail.com', -- owner_id should match an existing user_login_details.email
  'ClassDiagram',
  '{
    "id": "f3918f1c-f84a-4ef2-afc6-f6ae047a0e57",
    "title": "Use Case Diagram",
    "model": {
      "version": "3.0.0",
      "type": "ClassDiagram",
      "size": {
        "width": 1400,
        "height": 460
      },
      "interactive": {
        "elements": {},
        "relationships": {}
      },
      "elements": {
        "25599cd8-a314-47a6-8041-c2b3cb1bd360": {
          "id": "25599cd8-a314-47a6-8041-c2b3cb1bd360",
          "name": "CODPlayer",
          "type": "Class",
          "owner": null,
          "bounds": {
            "x": -160,
            "y": 90,
            "width": 160,
            "height": 40
          },
          "attributes": [],
          "methods": []
        },
        "2bf4a318-ab01-40e1-a7bb-446c9fd48965": {
          "id": "2bf4a318-ab01-40e1-a7bb-446c9fd48965",
          "name": "Player",
          "type": "Interface",
          "owner": null,
          "bounds": {
            "x": -180,
            "y": -210,
            "width": 160,
            "height": 170
          },
          "attributes": [],
          "methods": [
            "a28ddeb2-5ca4-4d37-801e-6b5257bde30a",
            "ddcbc349-809a-4211-b34d-bb42fa28a422",
            "96cae081-1084-494e-a1b7-c570c19c5645",
            "6d702508-1045-4f9d-9c79-7fe7f0b05788"
          ]
        },
        "a28ddeb2-5ca4-4d37-801e-6b5257bde30a": {
          "id": "a28ddeb2-5ca4-4d37-801e-6b5257bde30a",
          "name": "+ play():void",
          "type": "ClassMethod",
          "owner": "2bf4a318-ab01-40e1-a7bb-446c9fd48965",
          "bounds": {
            "x": -179.5,
            "y": -159.5,
            "width": 159,
            "height": 30
          }
        },
        "ddcbc349-809a-4211-b34d-bb42fa28a422": {
          "id": "ddcbc349-809a-4211-b34d-bb42fa28a422",
          "name": "+ stop():void",
          "type": "ClassMethod",
          "owner": "2bf4a318-ab01-40e1-a7bb-446c9fd48965",
          "bounds": {
            "x": -179.5,
            "y": -129.5,
            "width": 159,
            "height": 30
          }
        },
        "96cae081-1084-494e-a1b7-c570c19c5645": {
          "id": "96cae081-1084-494e-a1b7-c570c19c5645",
          "name": "+ pause():void",
          "type": "ClassMethod",
          "owner": "2bf4a318-ab01-40e1-a7bb-446c9fd48965",
          "bounds": {
            "x": -179.5,
            "y": -99.5,
            "width": 159,
            "height": 30
          }
        },
        "6d702508-1045-4f9d-9c79-7fe7f0b05788": {
          "id": "6d702508-1045-4f9d-9c79-7fe7f0b05788",
          "name": "+ reverse():void",
          "type": "ClassMethod",
          "owner": "2bf4a318-ab01-40e1-a7bb-446c9fd48965",
          "bounds": {
            "x": -179.5,
            "y": -69.5,
            "width": 159,
            "height": 30
          }
        },
        "d62965e3-a6ca-460d-ac26-c75cd19f1c7d": {
          "id": "d62965e3-a6ca-460d-ac26-c75cd19f1c7d",
          "name": "DVD",
          "type": "Class",
          "owner": null,
          "bounds": {
            "x": -410,
            "y": 100,
            "width": 160,
            "height": 40
          },
          "attributes": [],
          "methods": []
        },
        "c2be04b9-537c-478b-b294-c91a4ad56ea7": {
          "id": "c2be04b9-537c-478b-b294-c91a4ad56ea7",
          "name": "Recorder",
          "type": "Class",
          "owner": null,
          "bounds": {
            "x": 140,
            "y": 70,
            "width": 160,
            "height": 70
          },
          "attributes": [],
          "methods": [
            "357e0ff9-383b-4320-beca-5c5882e6f158"
          ]
        },
        "357e0ff9-383b-4320-beca-5c5882e6f158": {
          "id": "357e0ff9-383b-4320-beca-5c5882e6f158",
          "name": "+ record(): void",
          "type": "ClassMethod",
          "owner": "c2be04b9-537c-478b-b294-c91a4ad56ea7",
          "bounds": {
            "x": 140.5,
            "y": 110.5,
            "width": 159,
            "height": 30
          }
        },
        "174a88ee-f278-45c8-916c-1acedfbffba6": {
          "id": "174a88ee-f278-45c8-916c-1acedfbffba6",
          "name": "Studio",
          "type": "Class",
          "owner": null,
          "bounds": {
            "x": -550,
            "y": -180,
            "width": 160,
            "height": 40
          },
          "attributes": [],
          "methods": []
        },
        "1eb3fb6d-dea9-41e9-9ad9-bdf25a055676": {
          "id": "1eb3fb6d-dea9-41e9-9ad9-bdf25a055676",
          "name": "DVDPlayer",
          "type": "Class",
          "owner": null,
          "bounds": {
            "x": -680,
            "y": 100,
            "width": 160,
            "height": 40
          },
          "attributes": [],
          "methods": []
        }
      },
      "relationships": {
        "a92fa4ae-3ab4-41e9-9cac-a59ac853c632": {
          "id": "a92fa4ae-3ab4-41e9-9cac-a59ac853c632",
          "name": "",
          "type": "ClassRealization",
          "owner": null,
          "bounds": {
            "x": -335,
            "y": -135,
            "width": 155,
            "height": 235
          },
          "path": [
            {
              "x": 5,
              "y": 235
            },
            {
              "x": 5,
              "y": 10
            },
            {
              "x": 155,
              "y": 10
            }
          ],
          "source": {
            "direction": "Up",
            "element": "d62965e3-a6ca-460d-ac26-c75cd19f1c7d",
            "multiplicity": "",
            "role": ""
          },
          "target": {
            "direction": "Left",
            "element": "2bf4a318-ab01-40e1-a7bb-446c9fd48965",
            "multiplicity": "",
            "role": ""
          },
          "isManuallyLayouted": false
        },
        "071cb10d-54f8-4df3-a561-a970cb67f257": {
          "id": "071cb10d-54f8-4df3-a561-a970cb67f257",
          "name": "",
          "type": "ClassRealization",
          "owner": null,
          "bounds": {
            "x": -95,
            "y": -40,
            "width": 10,
            "height": 130
          },
          "path": [
            {
              "x": 5,
              "y": 130
            },
            {
              "x": 5,
              "y": 0
            }
          ],
          "source": {
            "direction": "Up",
            "element": "25599cd8-a314-47a6-8041-c2b3cb1bd360",
            "multiplicity": "",
            "role": ""
          },
          "target": {
            "direction": "Down",
            "element": "2bf4a318-ab01-40e1-a7bb-446c9fd48965",
            "multiplicity": "",
            "role": ""
          },
          "isManuallyLayouted": false
        },
        "5650fc4d-c5e9-4c46-be95-7465ae4abb83": {
          "id": "5650fc4d-c5e9-4c46-be95-7465ae4abb83",
          "name": "",
          "type": "ClassInheritance",
          "owner": null,
          "bounds": {
            "x": -20,
            "y": -135,
            "width": 245,
            "height": 205
          },
          "path": [
            {
              "x": 240,
              "y": 205
            },
            {
              "x": 240,
              "y": 10
            },
            {
              "x": 0,
              "y": 10
            }
          ],
          "source": {
            "direction": "Up",
            "element": "c2be04b9-537c-478b-b294-c91a4ad56ea7",
            "multiplicity": "",
            "role": ""
          },
          "target": {
            "direction": "Right",
            "element": "2bf4a318-ab01-40e1-a7bb-446c9fd48965",
            "multiplicity": "",
            "role": ""
          },
          "isManuallyLayouted": false
        },
        "03b6db50-52df-4ee3-873c-1d335103e0d4": {
          "id": "03b6db50-52df-4ee3-873c-1d335103e0d4",
          "name": "",
          "type": "ClassUnidirectional",
          "owner": null,
          "bounds": {
            "x": -390,
            "y": -170,
            "width": 210,
            "height": 31
          },
          "path": [
            {
              "x": 0,
              "y": 10
            },
            {
              "x": 210,
              "y": 10
            }
          ],
          "source": {
            "direction": "Right",
            "element": "174a88ee-f278-45c8-916c-1acedfbffba6",
            "multiplicity": "",
            "role": ""
          },
          "target": {
            "direction": "Left",
            "element": "2bf4a318-ab01-40e1-a7bb-446c9fd48965",
            "multiplicity": "",
            "role": ""
          },
          "isManuallyLayouted": false
        },
        "649a4464-257b-476c-a843-ba1b61625500": {
          "id": "649a4464-257b-476c-a843-ba1b61625500",
          "name": "",
          "type": "ClassAggregation",
          "owner": null,
          "bounds": {
            "x": -520,
            "y": 110,
            "width": 110,
            "height": 31
          },
          "path": [
            {
              "x": 0,
              "y": 10
            },
            {
              "x": 110,
              "y": 10
            }
          ],
          "source": {
            "direction": "Right",
            "element": "1eb3fb6d-dea9-41e9-9ad9-bdf25a055676",
            "multiplicity": "",
            "role": ""
          },
          "target": {
            "direction": "Left",
            "element": "d62965e3-a6ca-460d-ac26-c75cd19f1c7d",
            "multiplicity": "",
            "role": ""
          },
          "isManuallyLayouted": false
        }
      },
      "assessments": {}
    },
    "lastUpdate": "2025-03-30T14:32:42.156Z"
  }',
  NOW(),
  NOW()
);

UPDATE projects
SET diagram_json = '{YOUR_MINIFIED_JSON_STRING_HERE}'
WHERE id = 1;
