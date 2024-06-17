local DrawingText = {}

local function toggleNuiFrame(shouldShow)
  SetNuiFocus(shouldShow, shouldShow)
  SendReactMessage('setVisible', shouldShow)
end

RegisterCommand('+scenes', function()
  toggleNuiFrame(true)
end)

RegisterKeyMapping("+scenes", "Start Scenes", "keyboard", "o")

RegisterNUICallback('hideFrame', function(_, cb)
  toggleNuiFrame(false)
  cb({})
end)

RegisterNUICallback('placescene', function(data, cb)
  local text = data.text
  local color = data.color
  local font = data.font
  exports['ud-laser']:ToggleCreationLaser(function(coords)
    local textData = {
      text = text,
      color = color,
      font = font,
      coords = {x = coords.x, y = coords.y, z = coords.z},
      owner = GetPlayerServerId(PlayerId())
    }
    table.insert(DrawingText, textData)
    TriggerServerEvent('placescene:placed', textData)
  end)
  toggleNuiFrame(false)
  cb('ok')
end)

RegisterNetEvent('placescene:received')
AddEventHandler('placescene:received', function(textData)
  table.insert(DrawingText, textData)
end)

Citizen.CreateThread(function()
  while true do
    Citizen.Wait(0)
    local ped = PlayerPedId()
    local pedCoords = GetEntityCoords(ped)
    for i, textData in ipairs(DrawingText) do
      local textCoords = vector3(textData.coords.x, textData.coords.y, textData.coords.z)
      local distance = #(pedCoords - textCoords)
      if distance < 10.0 then
        local color = colorToRGB(textData.color)
        DrawText3D(textData.text, textData.coords.x, textData.coords.y, textData.coords.z, color, textData.font)
      end
    end
  end
end)

function DrawText3D(text, x, y, z, color, font)
  local onScreen, _x, _y = World3dToScreen2d(x, y, z)
  if onScreen then
    SetTextScale(0.35, 0.35)
    SetTextFont(fontToID(font))
    SetTextProportional(1)
    SetTextColour(color.r, color.g, color.b, 255)
    SetTextDropshadow(0, 0, 0, 0, 255)
    SetTextEdge(2, 0, 0, 0, 150)
    SetTextDropShadow()
    SetTextOutline()
    SetTextEntry("STRING")
    AddTextComponentString(text)
    DrawText(_x, _y)
  end
end

function colorToRGB(color)
  local colors = {
    Red = {r = 255, g = 0, b = 0},
    Blue = {r = 0, g = 0, b = 255},
    Green = {r = 0, g = 255, b = 0},
    Yellow = {r = 255, g = 255, b = 0},
    Orange = {r = 255, g = 165, b = 0},
    Purple = {r = 128, g = 0, b = 128},
    Pink = {r = 255, g = 192, b = 203},
    Black = {r = 0, g = 0, b = 0},
    White = {r = 255, g = 255, b = 255},
  }
  return colors[color] or {r = 255, g = 255, b = 255}
end

function fontToID(font)
  local fonts = {
    ["Default"] = 0,
    ["Fancy"] = 1,
    ["Monospace"] = 2,
    ["Comprime"] = 4,
    ["GTA"] = 7,
  }
  return fonts[font] or 0
end

RegisterCommand('removescene', function() 
  for i = #DrawingText, 1, -1 do 
    if DrawingText[i].owner == GetPlayerServerId(PlayerId()) then 
      TriggerServerEvent('placescene:removed', DrawingText[i])
      table.remove(DrawingText, i) 
      break 
    end 
  end 
end)

RegisterNetEvent('placescene:client:removed')
AddEventHandler('placescene:client:removed', function(sceneData)
  for i, textData in ipairs(DrawingText) do
    if textData.owner == sceneData.owner and textData.text == sceneData.text then
      table.remove(DrawingText, i)
      break
    end
  end
end)