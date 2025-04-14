import "@/styles/globals.css"
import Provider from '@/components/Provider'

export const metadata = {
  title: 'Plivo Status Page',
  description: 'View status of services provided by Plivo',
}

const RootLayout = ({children}) => {
  return (
    <html lang='en'>
      <body>
        <Provider>
          <main className='antialiased'>
            {children}
          </main>
        </Provider>
      </body>
    </html>
  )
}

export default RootLayout