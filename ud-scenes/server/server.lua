DrawingText = DrawingText or {}

RegisterNetEvent('placescene:placed')
AddEventHandler('placescene:placed', function(textData)
    TriggerClientEvent('placescene:received', -1, textData)
end)

RegisterNetEvent('placescene:removed')
AddEventHandler('placescene:removed', function(sceneData)
  for i, textData in ipairs(DrawingText) do
    if textData.id == sceneData.id then
      table.remove(DrawingText, i)
      break
    end
  end
  TriggerClientEvent('placescene:client:removed', -1, sceneData)
end)