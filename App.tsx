import "./_polyfills";
import { Console, Context, Effect, Layer } from "effect";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { ContentDispositionSchema } from "@uploadthing/shared"
import * as S from "@effect/schema/Schema";

const someContext = Context.GenericTag<{
  foo: string
}>("context");


const program = Effect.gen(function* ($) {
  const ctx = yield* $(someContext);
  const r = yield* $(S.decode(ContentDispositionSchema)(ctx.foo as any))
  yield* $(Console.log("Hello World", ctx, r))
})

const runEffect = () => {
  const layer = Layer.succeed(someContext, {
    foo: "inline"
  });

  return program.pipe(
    Effect.provide(layer), 
    Effect.catchAll(() => {
      return Effect.succeed(null);
    }),
    Effect.runSync
  )
}

export default function App() {
  runEffect()
  
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
