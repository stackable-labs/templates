import { ui, Surface, useContextData, useCapabilities, useSettings, useStore } from '@stackable-labs/sdk-extension-react'
import { appStore } from '../store'

export function Content() {
  const { loading } = useContextData()
  const settings = useSettings() // Non-secret settings (e.g. apiEndpoint) from settingsSchema
  const apiEndpoint = (settings.apiEndpoint as string) || 'https://jsonplaceholder.typicode.com'
  const { data, actions } = useCapabilities()
  const name = useStore(appStore, (s) => s.name)
  const dietaryNotes = useStore(appStore, (s) => s.dietaryNotes)
  const occasion = useStore(appStore, (s) => s.occasion)
  const partySize = useStore(appStore, (s) => s.partySize)
  const time = useStore(appStore, (s) => s.time)
  const waitlist = useStore(appStore, (s) => s.waitlist)
  const seating = useStore(appStore, (s) => s.seating)
  const billTotal = useStore(appStore, (s) => s.billTotal)

  if (loading) {
    return (
      <Surface id="slot.content">
        <ui.Stack direction="column" gap="2">
          <ui.Skeleton className="h-8 w-48" />
          <ui.Skeleton className="h-24 w-full" />
          <ui.Skeleton className="h-32 w-full" />
        </ui.Stack>
      </Surface>
    )
  }

  const handleFetchGet = async () => {
    try {
      const result = await data.fetch(`${apiEndpoint}/todos/1`)
      actions.toast({ message: `GET returned status ${result.status}. The proxy works!`, type: 'success', position: 'top-center', closeButton: true })
    } catch {
      actions.toast({ message: 'data.fetch GET demo — requires the data:fetch permission in the host.', type: 'info' })
    }
  }

  const handleAddRound = () => {
    const newTotal = appStore.get().billTotal + 30
    appStore.set({ billTotal: newTotal })
    handleInvokeExample()
  }

  const handleFetchPost = async () => {
    const total = appStore.get().billTotal
    try {
      const result = await data.fetch(`${apiEndpoint}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { title: 'Another round', body: 'From the kitchen sink', userId: 1 },
      })
      actions.toast({ message: `POST returned status ${result.status}. The proxy works!`, description: `Your total: $${total || 0}. Gratuity not included.`, type: 'success', position: 'top-center', closeButton: true })
    } catch {
      actions.toast({ message: 'Check is on the way!', description: `Your total: $${total || 0}. Gratuity not included.`, type: 'success', position: 'top-center', closeButton: true })
    }
  }

  const handleReservation = () => {
    const state = appStore.get()
    actions.toast({
      fetch: {
        url: `${apiEndpoint}/posts`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: state,
      },
      message: 'Reservation',
      loading: `Placing reservation for ${state.name || state.time}...`,
      success: `Reservation confirmed! Party of ${state.partySize} at ${state.time}. See you there!`,
      error: 'Reservation failed — the kitchen is overwhelmed. Try again!',
      position: 'top-center',
      closeButton: true,
    })
  }

  const handleInvokeExample = async () => {
    try {
      await actions.invoke('newConversation', {
        tags: ['stackable', 'kitchen-sink'],
        fields: [{ id: 'source', value: 'kitchen-sink-demo' }],
        metadata: { source: 'kitchen-sink-demo' },
      })
      actions.toast({ message: 'Chef fired actions.invoke AND actions.toast in one go. Two capabilities, one click...$30 straight to the head.', type: 'success' })
    } catch {
      actions.toast({ message: 'actions.invoke demo — the host would handle this action in production.', type: 'info' })
    }
  }

  return (
    <Surface id="slot.content">
      <ui.Tabs defaultValue="menu">
        <ui.TabsList className="mx-auto">
          <ui.TabsTrigger value="menu">Specials</ui.TabsTrigger>
          <ui.TabsTrigger value="details">"The Spread"</ui.TabsTrigger>
          <ui.TabsTrigger value="form">Next Rez</ui.TabsTrigger>
        </ui.TabsList>

        <ui.TabsContent value="menu">
          <ui.Menu>
            <ui.MenuItem
              icon="shopping-bag"
              label="See What's Cooking"
              description="Le full on — cards, badges, bars, alerts...everything but the fridge"
              onClick={() => actions.toast({ message: 'Chef says: check out "The Spread" tab for the full tasting menu!', type: 'info' })}
            />
            <ui.MenuItem
              icon="message-square"
              label="Ring the Service Bell"
              description="actions.toast + actions.invoke — two capabilities walk into a bar..."
              onClick={handleInvokeExample}
            />
            <ui.MenuItem
              icon="package"
              label="Order Takeout"
              description="data.fetch — send a secure HTTP request...to the moon!"
              onClick={handleFetchGet}
            />
          </ui.Menu>
          <ui.Stack direction="column" gap="2" className="pt-3">
            <ui.Alert variant="destructive">
              <ui.Text>Fire in the kitchen! (Relax — just showing off the destructive alert.)</ui.Text>
            </ui.Alert>
          </ui.Stack>
        </ui.TabsContent>

        <ui.TabsContent value="details">
          <ui.Stack direction="column" gap="3">
            <ui.Image
              alt="Restaurant interior"
              src="https://placehold.co/300x150/png?text=The+Spread"
              className="w-full rounded-md object-cover"
            />
            <ui.Card>
              <ui.CardHeader>
                <ui.Inline gap="2" className="justify-between">
                  <ui.Heading level="3">Chef's Tasting Menu</ui.Heading>
                  <ui.Badge variant="secondary">${billTotal}</ui.Badge>
                </ui.Inline>
              </ui.CardHeader>
              <ui.CardContent className="pb-6">
                <ui.Stack direction="column" gap="3">
                  <ui.Inline gap="2">
                    <ui.Text className="font-medium">Next Course:</ui.Text>
                    <ui.Badge variant="secondary" hue="blue">Seared Widgets</ui.Badge>
                  </ui.Inline>
                  <ui.Separator />
                  <ui.Text tone="muted">Every UI component in the SDK, plated and ready to serve. If something's missing, send it back to the kitchen.</ui.Text>
                  <ui.Stack direction="column" gap="1">
                    <ui.Progress value="68" />
                    <ui.Text className="text-xs" tone="muted">68% of courses served — dessert is still in the oven</ui.Text>
                  </ui.Stack>
                </ui.Stack>
              </ui.CardContent>
            </ui.Card>

            <ui.Alert variant="default">
              <ui.Text>Your next course is almost ready — get those utensils moving!</ui.Text>
            </ui.Alert>

            <ui.Collapsible>
              <ui.CollapsibleTrigger>
                Save room for dessert?
              </ui.CollapsibleTrigger>
              <ui.CollapsibleContent>
                <ui.Card>
                  <ui.CardContent>
                    <ui.Text tone="muted">
                      Of course there's dessert. This is the kitchen sink — we have everything.
                      You're looking at a Card nested inside a Collapsible. It's components all the way down — turtles wish they had this kind of nesting.
                    </ui.Text>
                  </ui.CardContent>
                </ui.Card>
              </ui.CollapsibleContent>
            </ui.Collapsible>

            <ui.Collapsible>
              <ui.CollapsibleTrigger>
                <ui.Button variant="outline">
                  <ui.Icon name="circle-play" size="sm" /> Watch our story
                </ui.Button>
              </ui.CollapsibleTrigger>
              <ui.CollapsibleContent>
                <ui.Video videoId="3_VhE3GGkOo" title="Our story" autoPlay={false} showControls={true} />
              </ui.CollapsibleContent>
            </ui.Collapsible>

            <ui.Card>
              <ui.CardHeader>
                <ui.Heading level="3">Reserve Your Table</ui.Heading>
              </ui.CardHeader>
              <ui.CardContent className="pb-6">
                <ui.Inline gap="3" align="center">
                  <ui.QRCode
                    value="https://github.com/stackable-labs"
                    size="md"
                    level="medium"
                    alt="Scan to reserve a table"
                  />
                  <ui.Stack direction="column" gap="1" className="flex-1">
                    <ui.Text className="font-medium">Scan to reserve</ui.Text>
                    <ui.Text tone="muted" className="text-xs">
                      Point your phone at the code — works on the kitchen sink, your phone, or both.
                    </ui.Text>
                  </ui.Stack>
                </ui.Inline>
              </ui.CardContent>
            </ui.Card>

            <ui.Inline gap="2" className="justify-end">
              <ui.Button variant="outline" onClick={handleAddRound}>
                Add a Round
              </ui.Button>
              <ui.Button variant="destructive" onClick={handleFetchPost}>
                Bring da Check
              </ui.Button>
            </ui.Inline>

          </ui.Stack>
        </ui.TabsContent>

        <ui.TabsContent value="form">
          <ui.Stack direction="column" gap="3">
            <ui.ScrollArea className="h-64 rounded-lg border bg-background">
              <ui.Stack direction="column" gap="3" className="p-3">
                <ui.Stack direction="column" gap="1">
                  <ui.Label htmlFor="name-input">Name</ui.Label>
                  <ui.Input id="name-input" placeholder="Party of one extension" value={name} onChange={(e) => appStore.set({ name: e.target.value })} />
                </ui.Stack>

                <ui.Stack direction="column" gap="1">
                  <ui.Label htmlFor="notes">Allergies or Dietary Notes</ui.Label>
                  <ui.Textarea id="notes" placeholder="No JSON, no YAML, absolutely no TOML..." value={dietaryNotes} onChange={(e) => appStore.set({ dietaryNotes: e.target.value })} />
                </ui.Stack>

                <ui.Stack direction="column" gap="1">
                  <ui.Label>Occasion</ui.Label>
                  <ui.Select value={occasion} onChange={(e) => appStore.set({ occasion: e.target.value })}>
                    <ui.SelectOption value="none">None</ui.SelectOption>
                    <ui.SelectOption value="meeting">Meeting</ui.SelectOption>
                    <ui.SelectOption value="birthday">Birthday</ui.SelectOption>
                    <ui.SelectOption value="anniversary">Anniversary</ui.SelectOption>
                    <ui.SelectOption value="date-night">Date Night</ui.SelectOption>
                    <ui.SelectOption value="survived-prod">Survived a Production Deploy</ui.SelectOption>
                  </ui.Select>
                </ui.Stack>

                <ui.Stack direction="column" gap="1">
                  <ui.Label>Party Size</ui.Label>
                  <ui.Inline gap="1">
                    {['1', '2', '4', '6', '8+'].map((size) => (
                      <ui.Button
                        key={size}
                        size="sm"
                        variant={partySize === size ? 'default' : 'outline'}
                        onClick={() => appStore.set({ partySize: size })}
                      >
                        {size}
                      </ui.Button>
                    ))}
                  </ui.Inline>
                </ui.Stack>

                <ui.Stack direction="column" gap="1">
                  <ui.Label>Time</ui.Label>
                  <ui.Inline gap="1">
                    {['5:30', '6:00', '7:00', '7:30', '8:30'].map((t) => (
                      <ui.Button
                        key={t}
                        size="sm"
                        variant={time === t ? 'default' : 'outline'}
                        onClick={() => appStore.set({ time: t })}
                      >
                        {t}
                      </ui.Button>
                    ))}
                  </ui.Inline>
                </ui.Stack>

                <ui.Inline gap="4">
                  <ui.Switch id="waitlist" checked={waitlist} onChange={(e) => appStore.set({ waitlist: e.target.value === 'true' })} />
                  <ui.Label htmlFor="waitlist">Add me to the waitlist if full</ui.Label>
                </ui.Inline>

                <ui.Stack direction="column" gap="1">
                  <ui.Label>Seating Preference</ui.Label>
                  <ui.RadioGroup value={seating} onChange={(e) => appStore.set({ seating: e.target.value })}>
                    <ui.Inline gap="2">
                      <ui.RadioGroupItem value="indoor" id="indoor" />
                      <ui.Label htmlFor="indoor">Indoor</ui.Label>
                    </ui.Inline>
                    <ui.Inline gap="2">
                      <ui.RadioGroupItem value="patio" id="patio" />
                      <ui.Label htmlFor="patio">Patio</ui.Label>
                    </ui.Inline>
                    <ui.Inline gap="2">
                      <ui.RadioGroupItem value="chefs-counter" id="chefs-counter" />
                      <ui.Label htmlFor="chefs-counter">Chef's Lap</ui.Label>
                    </ui.Inline>
                  </ui.RadioGroup>
                </ui.Stack>
              </ui.Stack>
            </ui.ScrollArea>

            <ui.Inline gap="2" className="justify-end">
              <ui.Button onClick={handleReservation}>
                Lock it In
              </ui.Button>
            </ui.Inline>

            <ui.Link href="https://docs.stackablelabs.io" className="text-xs pt-3">
              <ui.Inline gap="1">
                <ui.Icon name="book-open" size="sm" />
                Allergen/Recipe Details
              </ui.Inline>
            </ui.Link>
          </ui.Stack>
        </ui.TabsContent>
      </ui.Tabs>
    </Surface>
  )
}
